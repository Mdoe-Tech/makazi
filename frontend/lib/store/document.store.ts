import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import { documentService } from '../api/document/service';
import type { Document, DocumentFilters } from '../api/document/types';
import { PaginationParams } from '../api/types';

interface DocumentState {
  documents: Document[];
  selectedDocument: Document | null;
  total: number;
  loading: boolean;
  error: string | null;
  filters: DocumentFilters;
  pagination: PaginationParams;
  // Actions
  setFilters: (filters: DocumentFilters) => void;
  setPagination: (pagination: PaginationParams) => void;
  setSelectedDocument: (document: Document | null) => void;
  fetchDocuments: () => Promise<void>;
  fetchDocumentById: (id: string) => Promise<void>;
  uploadDocument: (data: FormData) => Promise<void>;
  deleteDocument: (id: string) => Promise<void>;
  reset: () => void;
}

const initialState = {
  documents: [],
  selectedDocument: null,
  total: 0,
  loading: false,
  error: null,
  filters: {},
  pagination: {
    page: 1,
    limit: 10,
  },
};

export const useDocumentStore = create<DocumentState>()(
  devtools(
    persist(
      (set, get) => ({
        ...initialState,

        setFilters: (filters) => set({ filters }),
        setPagination: (pagination) => set({ pagination }),
        setSelectedDocument: (document) => set({ selectedDocument: document }),

        fetchDocuments: async () => {
          try {
            set({ loading: true, error: null });
            const { filters, pagination } = get();
            const response = await documentService.getDocuments({ ...filters, ...pagination });
            set({ 
              documents: response.data,
              total: response.total,
              loading: false 
            });
          } catch (error) {
            set({ 
              error: error instanceof Error ? error.message : 'Failed to fetch documents',
              loading: false 
            });
          }
        },

        fetchDocumentById: async (id) => {
          try {
            set({ loading: true, error: null });
            const response = await documentService.getDocumentById(id);
            set({ 
              selectedDocument: response.data,
              loading: false 
            });
          } catch (error) {
            set({ 
              error: error instanceof Error ? error.message : 'Failed to fetch document',
              loading: false 
            });
          }
        },

        uploadDocument: async (data) => {
          try {
            set({ loading: true, error: null });
            await documentService.uploadDocument(data);
            await get().fetchDocuments();
          } catch (error) {
            set({ 
              error: error instanceof Error ? error.message : 'Failed to upload document',
              loading: false 
            });
          }
        },

        deleteDocument: async (id) => {
          try {
            set({ loading: true, error: null });
            await documentService.deleteDocument(id);
            await get().fetchDocuments();
            if (get().selectedDocument?.id === id) {
              set({ selectedDocument: null });
            }
          } catch (error) {
            set({ 
              error: error instanceof Error ? error.message : 'Failed to delete document',
              loading: false 
            });
          }
        },

        reset: () => set(initialState),
      }),
      {
        name: 'document-store',
        partialize: (state) => ({
          filters: state.filters,
          pagination: state.pagination,
        }),
      }
    )
  )
); 