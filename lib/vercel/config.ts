export async function getVercelAccessToken(): Promise<string> {
  const token = process.env.VERCEL_ACCESS_TOKEN
  if (!token) {
    throw new Error('VERCEL_ACCESS_TOKEN is not configured')
  }
  return token
}

export function getVercelProjectId(): string {
  const projectId = process.env.VERCEL_PROJECT_ID
  if (!projectId) {
    throw new Error('VERCEL_PROJECT_ID is not configured')
  }
  return projectId
} 