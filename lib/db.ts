// lib/db.ts
import { ref, get, set, update, push, remove } from 'firebase/database';
import { db as firebaseDbRef } from '@/lib/firebase/client'; // Renamed to be more clear
import { Roadmap } from '@/lib/ai-client';

export const databaseService = {
  getRoadmaps: async (userId?: string) => {
    try {
      const roadmapsRef = ref(firebaseDbRef, 'roadmaps');
      const snapshot = await get(roadmapsRef);
      
      if (!snapshot.exists()) {
        return [];
      }
      
      const roadmaps: Roadmap[] = [];
      snapshot.forEach((childSnapshot) => {
        const roadmap = childSnapshot.val();
        if (!userId || roadmap.userId === userId) {
          roadmaps.push({
            ...roadmap,
            id: childSnapshot.key
          });
        }
      });
      
      return roadmaps;
    } catch (error) {
      console.error('Error fetching roadmaps:', error);
      return [];
    }
  },
  
  getRoadmapById: async (id: string) => {
    try {
      const roadmapRef = ref(firebaseDbRef, `roadmaps/${id}`);
      const snapshot = await get(roadmapRef);
      
      if (!snapshot.exists()) {
        return null;
      }
      
      return {
        ...snapshot.val(),
        id: snapshot.key
      };
    } catch (error) {
      console.error('Error fetching roadmap:', error);
      return null;
    }
  },
  
  saveRoadmap: async (roadmap: Roadmap, userId?: string) => {
    try {
      const roadmapWithUser = userId ? { ...roadmap, userId } : roadmap;
      
      if (roadmap.id) {
        // Update existing roadmap
        const roadmapRef = ref(firebaseDbRef, `roadmaps/${roadmap.id}`);
        await update(roadmapRef, roadmapWithUser);
      } else {
        // Create new roadmap
        const roadmapsRef = ref(firebaseDbRef, 'roadmaps');
        const newRoadmapRef = push(roadmapsRef);
        await set(newRoadmapRef, {
          ...roadmapWithUser,
          id: newRoadmapRef.key,
          createdAt: new Date().toISOString()
        });
        roadmapWithUser.id = newRoadmapRef.key || '';
      }
      
      return roadmapWithUser;
    } catch (error) {
      console.error('Error saving roadmap:', error);
      throw error;
    }
  },
  
  updateWeekStatus: async (roadmapId: string, weekNumber: number, completed: boolean) => {
    try {
      // First get the current roadmap
      const roadmap = await databaseService.getRoadmapById(roadmapId);
      
      if (!roadmap) {
        return null;
      }
      
      // Update the specific week
      const updatedWeeks = roadmap.weeks.map(week => {
        if (week.week === weekNumber) {
          return { ...week, completed };
        }
        return week;
      });
      
      // Calculate progress
      const completedWeeks = updatedWeeks.filter(w => w.completed).length;
      const progress = Math.round((completedWeeks / updatedWeeks.length) * 100);
      const isCompleted = progress === 100;
      
      // Update the roadmap
      const updatedRoadmap = {
        ...roadmap,
        weeks: updatedWeeks,
        progress,
        isCompleted
      };
      
      // Save to Firebase
      const roadmapRef = ref(firebaseDbRef, `roadmaps/${roadmapId}`);
      await update(roadmapRef, updatedRoadmap);
      
      return updatedRoadmap;
    } catch (error) {
      console.error('Error updating week status:', error);
      return null;
    }
  },
  
  clearRoadmaps: async () => {
    try {
      console.log('Clearing all roadmaps');
      const roadmapsRef = ref(firebaseDbRef, 'roadmaps');
      await remove(roadmapsRef);
      return { success: true };
    } catch (error) {
      console.error('Error clearing roadmaps:', error);
      return { 
        success: false, 
        error: error instanceof Error ? error.message : String(error) 
      };
    }
  }
};

// For backward compatibility and consistent naming
export const serverDb = databaseService;
export const firebaseDb = databaseService; // Export your service as firebaseDb
export const firebaseService = databaseService;

// Don't export the raw Firebase reference as it will cause confusion
