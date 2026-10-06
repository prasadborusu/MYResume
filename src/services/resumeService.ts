import { ResumeRecord, ResumeData, TemplateId } from '../types/resume';
import { supabase, isSupabaseConfigured } from './supabase';
import { emptyResumeData, sampleResumeData } from '../utils/initialData';

const LOCAL_RESUMES_KEY = 'my_resumes_store';

function getLocalResumes(): ResumeRecord[] {
  try {
    const raw = localStorage.getItem(LOCAL_RESUMES_KEY);
    if (!raw) return [];
    return JSON.parse(raw);
  } catch (e) {
    console.error('Error reading local resumes:', e);
    return [];
  }
}

function saveLocalResumes(resumes: ResumeRecord[]) {
  localStorage.setItem(LOCAL_RESUMES_KEY, JSON.stringify(resumes));
}

export const resumeService = {
  // Get all resumes for user
  async getUserResumes(userId: string): Promise<ResumeRecord[]> {
    if (isSupabaseConfigured && supabase) {
      try {
        const { data, error } = await supabase
          .from('resumes')
          .select('*')
          .eq('user_id', userId)
          .order('updated_at', { ascending: false });

        if (!error && data) {
          return data as ResumeRecord[];
        }
      } catch (err) {
        console.warn('Supabase query failed, using local storage:', err);
      }
    }

    // Local fallback
    const all = getLocalResumes();
    return all
      .filter((r) => r.user_id === userId || r.user_id === 'guest')
      .sort((a, b) => new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime());
  },

  // Get single resume by ID
  async getResumeById(id: string): Promise<ResumeRecord | null> {
    if (isSupabaseConfigured && supabase) {
      try {
        const { data, error } = await supabase
          .from('resumes')
          .select('*')
          .eq('id', id)
          .single();

        if (!error && data) {
          return data as ResumeRecord;
        }
      } catch (err) {
        console.warn('Supabase getResumeById failed, falling back:', err);
      }
    }

    const all = getLocalResumes();
    return all.find((r) => r.id === id) || null;
  },

  // Create new resume
  async createResume(params: {
    userId: string;
    title?: string;
    templateId?: TemplateId;
    initialData?: ResumeData;
    isSample?: boolean;
  }): Promise<ResumeRecord> {
    const newId = 'res_' + Math.random().toString(36).substring(2, 11);
    const now = new Date().toISOString();
    
    const resumeData = params.initialData 
      ? params.initialData 
      : params.isSample 
        ? JSON.parse(JSON.stringify(sampleResumeData)) 
        : JSON.parse(JSON.stringify(emptyResumeData));

    const newResume: ResumeRecord = {
      id: newId,
      user_id: params.userId,
      title: params.title || 'Untitled Resume',
      template_id: params.templateId || 'modern',
      resume_data: resumeData,
      created_at: now,
      updated_at: now
    };

    if (isSupabaseConfigured && supabase) {
      try {
        const { data, error } = await supabase
          .from('resumes')
          .insert({
            user_id: params.userId,
            title: newResume.title,
            template_id: newResume.template_id,
            resume_data: newResume.resume_data
          })
          .select()
          .single();

        if (!error && data) {
          return data as ResumeRecord;
        }
      } catch (err) {
        console.warn('Supabase insert failed, saving locally:', err);
      }
    }

    // Save to local store
    const all = getLocalResumes();
    const updated = [newResume, ...all];
    saveLocalResumes(updated);

    return newResume;
  },

  // Update resume data
  async updateResume(id: string, updates: Partial<{
    title: string;
    template_id: TemplateId;
    resume_data: ResumeData;
  }>): Promise<ResumeRecord | null> {
    const now = new Date().toISOString();

    if (isSupabaseConfigured && supabase) {
      try {
        const { data, error } = await supabase
          .from('resumes')
          .update({
            ...updates,
            updated_at: now
          })
          .eq('id', id)
          .select()
          .single();

        if (!error && data) {
          return data as ResumeRecord;
        }
      } catch (err) {
        console.warn('Supabase update failed, saving locally:', err);
      }
    }

    // Update in local store
    const all = getLocalResumes();
    const index = all.findIndex((r) => r.id === id);
    if (index === -1) return null;

    const existing = all[index];
    const updatedRecord: ResumeRecord = {
      ...existing,
      ...updates,
      updated_at: now
    };

    all[index] = updatedRecord;
    saveLocalResumes(all);

    return updatedRecord;
  },

  // Duplicate resume
  async duplicateResume(id: string, userId: string): Promise<ResumeRecord | null> {
    const original = await this.getResumeById(id);
    if (!original) return null;

    return this.createResume({
      userId,
      title: `Copy of ${original.title}`,
      templateId: original.template_id,
      initialData: JSON.parse(JSON.stringify(original.resume_data))
    });
  },

  // Delete resume
  async deleteResume(id: string): Promise<boolean> {
    if (isSupabaseConfigured && supabase) {
      try {
        const { error } = await supabase
          .from('resumes')
          .delete()
          .eq('id', id);

        if (!error) return true;
      } catch (err) {
        console.warn('Supabase delete failed:', err);
      }
    }

    const all = getLocalResumes();
    const filtered = all.filter((r) => r.id !== id);
    saveLocalResumes(filtered);
    return true;
  }
};
