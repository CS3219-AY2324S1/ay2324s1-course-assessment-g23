import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { create } from 'zustand'
import {
    CodeExecutionResponse,
    DEFAULT_LANGUAGE,
    executeCode,
    type Language,
} from '../api/codeExecution'
import type { ApiError } from '../api/error'

export interface DocState {
    doc: string
    setDoc: (doc: string) => void
}

export const useDocStore = create<DocState>((set) => ({
    doc: '',
    setDoc: (doc: string) => set({ doc }),
}))

export interface LanguageState {
    language: Language
    setLanguage: (language: Language) => void
}

export const useLanguage = create<LanguageState>((set) => ({
    language: DEFAULT_LANGUAGE,
    setLanguage: (language: Language) => {
        set({ language: language })
    },
}))

export function useCodeExecutionOutput() {
    return useQuery<CodeExecutionResponse | null, ApiError>({
        queryKey: ['code_execution_output'],
        initialData: null,
        enabled: false,
    })
}

export function useExecuteCode() {
    const doc = useDocStore((state) => state.doc)
    const language = useLanguage((state) => state.language)
    const queryClient = useQueryClient()
    return useMutation(() => executeCode({ language_id: language.id, source_code: doc }), {
        onSuccess: (data) => {
            queryClient.setQueryData(['code_execution_output'], data)
        },
        onError: (_: ApiError) => {},
    })
}
