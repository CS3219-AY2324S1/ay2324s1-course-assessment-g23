import { ApiError } from './error'

/** URL for code-execution API. */
const CODE_EXECUTION_API_URL = '/api/code_execution'

/** HTTP request headers for question bank API. */
const CODE_EXECUTION_API_HEADER = { 'Content-Type': 'application/json' }

export interface CodeExecutionRequest {
    language_id: number
    source_code: string
}

export type CodeExecutionResponse =
    | {
          hasError: false
          errorMessage: null
          stdout: string | null
      }
    | {
          hasError: true
          errorMessage: string
          stdout: string | null
      }

interface Judge0Response {
    compile_output: string | null
    memory: number
    message: string | null
    status: {
        id: number
        description: string
    }
    stderr: string | null
    stdout: string | null
    time: string
    token: string
}

/**
 * Execute code.
 *
 * @param codePayload - The code and the language to execute on.
 * @returns Resolves with the `stdout`, `stderr` outputs and execution time.
 * @throws {ApiError} Throws an ApiError if the API response indicates an error.
 */
export async function executeCode(
    codePayload: CodeExecutionRequest
): Promise<CodeExecutionResponse> {
    const isBlankCode = codePayload.source_code.trim().length === 0
    if (isBlankCode)
        return {
            hasError: true,
            errorMessage: 'Source code cannot be blank!',
            stdout: null,
        }

    const response = await fetch(CODE_EXECUTION_API_URL + '/execute', {
        method: 'POST',
        headers: CODE_EXECUTION_API_HEADER,
        body: JSON.stringify(codePayload),
        credentials: 'include',
    })

    if (!response.ok) throw await ApiError.parseResponse(response)

    const data: Judge0Response = await response.json()

    const ACCEPTED_STATUS = 3
    if (data.status.id === ACCEPTED_STATUS)
        return {
            hasError: false,
            errorMessage: null,
            stdout: data.stdout,
        }

    let errorMessage = data.stderr ? data.stderr + '\n' : ''
    errorMessage += data.compile_output ? data.compile_output + '\n' : ''
    errorMessage += data.message ? data.message + '\n' : ''

    return {
        hasError: true,
        errorMessage,
        stdout: data.stdout,
    }
}

export interface Language {
    id: number
    name: string
}

/** Languages available in the Judge0 server. */
const JUDGE0_LANGUAGES: Language[] = [
    { id: 45, name: 'Assembly (NASM 2.14.02)' },
    { id: 46, name: 'Bash (5.0.0)' },
    { id: 47, name: 'Basic (FBC 1.07.1)' },
    { id: 75, name: 'C (Clang 7.0.1)' },
    { id: 76, name: 'C++ (Clang 7.0.1)' },
    { id: 48, name: 'C (GCC 7.4.0)' },
    { id: 52, name: 'C++ (GCC 7.4.0)' },
    { id: 49, name: 'C (GCC 8.3.0)' },
    { id: 53, name: 'C++ (GCC 8.3.0)' },
    { id: 50, name: 'C (GCC 9.2.0)' },
    { id: 54, name: 'C++ (GCC 9.2.0)' },
    { id: 86, name: 'Clojure (1.10.1)' },
    { id: 51, name: 'C# (Mono 6.6.0.161)' },
    { id: 77, name: 'COBOL (GnuCOBOL 2.2)' },
    { id: 55, name: 'Common Lisp (SBCL 2.0.0)' },
    { id: 56, name: 'D (DMD 2.089.1)' },
    { id: 57, name: 'Elixir (1.9.4)' },
    { id: 58, name: 'Erlang (OTP 22.2)' },
    { id: 44, name: 'Executable' },
    { id: 87, name: 'F# (.NET Core SDK 3.1.202)' },
    { id: 59, name: 'Fortran (GFortran 9.2.0)' },
    { id: 60, name: 'Go (1.13.5)' },
    { id: 88, name: 'Groovy (3.0.3)' },
    { id: 61, name: 'Haskell (GHC 8.8.1)' },
    { id: 62, name: 'Java (OpenJDK 13.0.1)' },
    { id: 63, name: 'JavaScript (Node.js 12.14.0)' },
    { id: 78, name: 'Kotlin (1.3.70)' },
    { id: 64, name: 'Lua (5.3.5)' },
    { id: 89, name: 'Multi-file program' },
    { id: 79, name: 'Objective-C (Clang 7.0.1)' },
    { id: 65, name: 'OCaml (4.09.0)' },
    { id: 66, name: 'Octave (5.1.0)' },
    { id: 67, name: 'Pascal (FPC 3.0.4)' },
    { id: 85, name: 'Perl (5.28.1)' },
    { id: 68, name: 'PHP (7.4.1)' },
    { id: 43, name: 'Plain Text' },
    { id: 69, name: 'Prolog (GNU Prolog 1.4.5)' },
    { id: 70, name: 'Python (2.7.17)' },
    { id: 71, name: 'Python (3.8.1)' },
    { id: 80, name: 'R (4.0.0)' },
    { id: 72, name: 'Ruby (2.7.0)' },
    { id: 73, name: 'Rust (1.40.0)' },
    { id: 81, name: 'Scala (2.13.2)' },
    { id: 82, name: 'SQL (SQLite 3.27.2)' },
    { id: 83, name: 'Swift (5.2.3)' },
    { id: 74, name: 'TypeScript (3.7.4)' },
    { id: 84, name: 'Visual Basic.Net (vbnc 0.0.0.5943)' },
]

const DEFAULT_LANGUAGE_ID = 63
const AVAILABLE_LANGUAGE_IDS = [51, 60, DEFAULT_LANGUAGE_ID, 71, 73, 82, 83]
const removeLanguageVersion = (languageName: string) => languageName.replace(/\s+\(.+\)$/, '')

/** Languages available to the user. */
export const AVAILABLE_LANGUAGES: Language[] = JUDGE0_LANGUAGES.filter((x) =>
    AVAILABLE_LANGUAGE_IDS.includes(x.id)
).map((x) => ({ ...x, name: removeLanguageVersion(x.name) }))

/** Default language of user. */
export const DEFAULT_LANGUAGE: Language = AVAILABLE_LANGUAGES.find(
    (x) => x.id === DEFAULT_LANGUAGE_ID
)!
