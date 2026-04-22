export class GithubService {
  static async getPublicRepos(username: string) {
    const headers: Record<string, string> = {
      Accept: 'application/vnd.github.v3+json',
      'User-Agent': 'GoWo-App',
    };
    if (process.env.GITHUB_TOKEN) {
      headers['Authorization'] = `Bearer ${process.env.GITHUB_TOKEN}`;
    }
    const response = await fetch(
      `https://api.github.com/users/${username}/repos?sort=updated&per_page=6&type=public`,
      { headers }
    );
    if (response.status === 404) throw new Error('Usuario de GitHub no encontrado');
    if (!response.ok) throw new Error('Error al consultar la API de GitHub');
    const data = await response.json();
    return (data as any[]).map((r) => ({
      id: r.id,
      name: r.name,
      description: r.description,
      url: r.html_url,
      language: r.language,
      stars: r.stargazers_count,
      forks: r.forks_count,
      updatedAt: r.updated_at,
    }));
  }
}
