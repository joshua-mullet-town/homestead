'use client';

import { useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';

// Simple icon components with default sizing
const HomeIcon = ({ className = "w-6 h-6", ...props }: any) => <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" className={className} {...props}><path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z"/></svg>;
const LinkIcon = ({ className = "w-6 h-6", ...props }: any) => <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" className={className} {...props}><path d="M3.9 12c0-1.71 1.39-3.1 3.1-3.1h4V7H7c-2.76 0-5 2.24-5 5s2.24 5 5 5h4v-1.9H7c-1.71 0-3.1-1.39-3.1-3.1zM8 13h8v-2H8v2zm9-6h-4v1.9h4c1.71 0 3.1 1.39 3.1 3.1s-1.39 3.1-3.1 3.1h-4V17h4c2.76 0 5-2.24 5-5s-2.24-5-5-5z"/></svg>;
const PowerIcon = ({ className = "w-6 h-6", ...props }: any) => <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" className={className} {...props}><path d="M13 3h-2v10h2V3zm4.83 2.17l-1.42 1.42C17.99 7.86 19 9.81 19 12c0 3.87-3.13 7-7 7s-7-3.13-7-7c0-2.19 1.01-4.14 2.58-5.42L6.17 5.17C4.23 6.82 3 9.26 3 12c0 4.97 4.03 9 9 9s9-4.03 9-9c0-2.74-1.23-5.18-3.17-6.83z"/></svg>;
const SlidersIcon = ({ className = "w-6 h-6", ...props }: any) => <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" className={className} {...props}><path d="M3 17v2h6v-2H3zM3 5v2h10V5H3zm10 16v-2h8v-2h-8v-2h-2v6h2zM7 9v2H3v2h4v2h2V9H7zm14 4v-2H11v2h10zm-6-4h2V7h4V5h-4V3h-2v6z"/></svg>;
const CheckIcon = ({ className = "w-6 h-6", ...props }: any) => <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" className={className} {...props}><path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/></svg>;
const ZapIcon = ({ className = "w-6 h-6", ...props }: any) => <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" className={className} {...props}><path d="M7 2v11h3v9l7-12h-4l4-8z"/></svg>;
const ReloadIcon = ({ className = "w-6 h-6", ...props }: any) => <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" className={className} {...props}><path d="M17.65 6.35C16.2 4.9 14.21 4 12 4c-4.42 0-7.99 3.58-7.99 8s3.57 8 7.99 8c3.73 0 6.84-2.55 7.73-6h-2.08c-.82 2.33-3.04 4-5.65 4-3.31 0-6-2.69-6-6s2.69-6 6-6c1.66 0 3.14.69 4.22 1.78L13 11h7V4l-2.35 2.35z"/></svg>;
const BugIcon = ({ className = "w-6 h-6", ...props }: any) => <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" className={className} {...props}><path d="M20 8h-2.81c-.45-.78-1.07-1.45-1.82-1.96L17 4.41 15.59 3l-2.17 2.17C12.96 5.06 12.49 5 12 5c-.49 0-.96.06-1.41.17L8.41 3 7 4.41l1.62 1.63C7.88 6.55 7.26 7.22 6.81 8H4v2h2.09c-.05.33-.09.66-.09 1v1H4v2h2v1c0 .34.04.67.09 1H4v2h2.81c1.04 1.79 2.97 3 5.19 3s4.15-1.21 5.19-3H20v-2h-2.09c.05-.33.09-.66.09-1v-1h2v-2h-2v-1c0-.34-.04-.67-.09-1H20V8zm-6 8h-4v-2h4v2zm0-4h-4v-2h4v2z"/></svg>;
const LightbulbIcon = ({ className = "w-6 h-6", ...props }: any) => <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" className={className} {...props}><path d="M9 21c0 .55.45 1 1 1h4c.55 0 1-.45 1-1v-1H9v1zm3-19C8.14 2 5 5.14 5 9c0 2.38 1.19 4.47 3 5.74V17c0 .55.45 1 1 1h6c.55 0 1-.45 1-1v-2.26c1.81-1.27 3-3.36 3-5.74 0-3.86-3.14-7-7-7zm2.85 11.1l-.85.6V16h-4v-2.3l-.85-.6C7.8 12.16 7 10.63 7 9c0-2.76 2.24-5 5-5s5 2.24 5 5c0 1.63-.8 3.16-2.15 4.1z"/></svg>;
const CodeIcon = ({ className = "w-6 h-6", ...props }: any) => <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" className={className} {...props}><path d="M9.4 16.6L4.8 12l4.6-4.6L8 6l-6 6 6 6 1.4-1.4zm5.2 0l4.6-4.6-4.6-4.6L16 6l6 6-6 6-1.4-1.4z"/></svg>;
const PlusIcon = ({ className = "w-6 h-6", ...props }: any) => <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" className={className} {...props}><path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"/></svg>;
const ChevronLeftIcon = ({ className = "w-6 h-6", ...props }: any) => <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" className={className} {...props}><path d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z"/></svg>;
const TerminalIcon = ({ className = "w-6 h-6", ...props }: any) => <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" className={className} {...props}><path d="M20 4H4c-1.11 0-2 .89-2 2v12c0 1.11.89 2 2 2h16c1.11 0 2-.89 2-2V6c0-1.11-.89-2-2-2zm0 14H4V8h16v10zm-2-1h-6v-2h6v2zM7.5 17l-1.41-1.41L8.67 13l-2.58-2.59L7.5 9l4 4-4 4z"/></svg>;
const TrashIcon = ({ className = "w-6 h-6", ...props }: any) => <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" className={className} {...props}><path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"/></svg>;

type User = {
  login: string;
  avatar_url: string;
  name: string;
};

type Repo = {
  id: number;
  name: string;
  full_name: string;
  owner: { login: string };
  open_issues_count: number;
};

type Issue = {
  id: number;
  number: number;
  title: string;
  body?: string;
  labels: { name: string }[];
  html_url: string;
};

export default function Home() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [user, setUser] = useState<User | null>(null);
  const [repos, setRepos] = useState<Repo[]>([]);
  const [issues, setIssues] = useState<Issue[]>([]);
  const [isProvisioning, setIsProvisioning] = useState(false);

  // Get selected repo and issue from URL
  const selectedRepoName = searchParams.get('repo');
  const selectedIssueNumber = searchParams.get('issue');

  const selectedRepo = repos.find(r => r.full_name === selectedRepoName) || null;
  const selectedIssue = issues.find(i => i.number === Number(selectedIssueNumber)) || null;
  const [loading, setLoading] = useState(true);
  const [hiddenRepos, setHiddenRepos] = useState<Set<number>>(new Set());
  const [manageMode, setManageMode] = useState(false);
  const [showCreateIssue, setShowCreateIssue] = useState(false);
  const [newIssueTitle, setNewIssueTitle] = useState('');
  const [newIssueBody, setNewIssueBody] = useState('');
  const [creatingIssue, setCreatingIssue] = useState(false);
  const [pollingForNewIssue, setPollingForNewIssue] = useState(false);
  const [showSessions, setShowSessions] = useState(false);
  const [sessions, setSessions] = useState<any[]>([]);
  const [existingSession, setExistingSession] = useState<any>(null);
  const [checkingSession, setCheckingSession] = useState(false);

  useEffect(() => {
    // Check if we have a GitHub token
    const token = localStorage.getItem('github_token');
    if (token) {
      fetchUser(token);
    } else {
      setLoading(false);
    }

    // Load hidden repos from localStorage
    const hidden = localStorage.getItem('hidden_repos');
    if (hidden) {
      setHiddenRepos(new Set(JSON.parse(hidden)));
    }
  }, []);

  // Load issues when repo is selected via URL
  useEffect(() => {
    // Wait for repos to load
    if (!selectedRepoName || repos.length === 0) return;

    const repo = repos.find(r => r.full_name === selectedRepoName);
    if (repo && issues.length === 0) {
      fetchIssues(repo);
    }
  }, [selectedRepoName, repos.length]);

  const fetchUser = async (token: string) => {
    try {
      const res = await fetch('https://api.github.com/user', {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        const userData = await res.json();
        setUser(userData);
        fetchRepos(token);
      } else {
        localStorage.removeItem('github_token');
        setLoading(false);
      }
    } catch (e) {
      console.error('Failed to fetch user:', e);
      setLoading(false);
    }
  };

  const fetchRepos = async (token: string) => {
    try {
      // Fetch all repos with pagination
      let allRepos: Repo[] = [];
      let page = 1;
      let hasMore = true;

      while (hasMore && page <= 10) { // Max 10 pages = 1000 repos
        const res = await fetch(`https://api.github.com/user/repos?sort=pushed&per_page=100&page=${page}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (res.ok) {
          const repoData = await res.json();

          if (repoData.length === 0) {
            hasMore = false;
          } else {
            allRepos = [...allRepos, ...repoData];
            page++;
          }
        } else {
          hasMore = false;
        }
      }

      setRepos(allRepos);
    } catch (e) {
      console.error('Failed to fetch repos:', e);
    } finally {
      setLoading(false);
    }
  };

  const fetchIssues = async (repo: Repo) => {
    const token = localStorage.getItem('github_token');
    if (!token) return;

    try {
      console.log('[fetchIssues] Fetching issues for:', repo.full_name);
      const res = await fetch(`https://api.github.com/repos/${repo.full_name}/issues?state=open`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        const issueData = await res.json();
        console.log('[fetchIssues] Got issues:', issueData.length);
        setIssues(issueData);
        // Only update URL if we're not already on a repo page (i.e., user clicked from home)
        // Don't overwrite URL if we're loading issues from existing URL params
        if (!selectedRepoName) {
          router.push(`/?repo=${encodeURIComponent(repo.full_name)}`);
        }
      } else {
        console.error('[fetchIssues] Response not OK:', res.status, res.statusText);
      }
    } catch (e) {
      console.error('Failed to fetch issues:', e);
    }
  };

  const connectGitHub = () => {
    // For now, let's use GitHub's device flow or redirect to OAuth
    // We'll need a backend endpoint for this, but for POC let's use a token input
    const token = prompt('Enter your GitHub Personal Access Token (will be stored locally):');
    if (token) {
      localStorage.setItem('github_token', token);
      fetchUser(token);
    }
  };

  const disconnect = () => {
    localStorage.removeItem('github_token');
    setUser(null);
    setRepos([]);
    router.push('/');
    setIssues([]);
  };

  const toggleHideRepo = (repoId: number) => {
    const newHidden = new Set(hiddenRepos);
    if (newHidden.has(repoId)) {
      newHidden.delete(repoId);
    } else {
      newHidden.add(repoId);
    }
    setHiddenRepos(newHidden);
    localStorage.setItem('hidden_repos', JSON.stringify(Array.from(newHidden)));
  };

  const fetchSessions = async () => {
    try {
      const response = await fetch('/api/droplets/list');
      if (response.ok) {
        const data = await response.json();
        setSessions(data.sessions || []);
      }
    } catch (error) {
      console.error('[fetchSessions] Error:', error);
    }
  };

  const checkForExistingSession = async (repoName: string, issueNumber: number) => {
    setCheckingSession(true);
    try {
      const response = await fetch(`/api/droplets/find-session?repoName=${encodeURIComponent(repoName)}&issueNumber=${issueNumber}`);
      if (response.ok) {
        const data = await response.json();
        setExistingSession(data.found ? data.session : null);
      }
    } catch (error) {
      console.error('[checkForExistingSession] Error:', error);
      setExistingSession(null);
    } finally {
      setCheckingSession(false);
    }
  };

  const destroySession = async (sessionId: string) => {
    if (!confirm('Are you sure you want to destroy this session?')) return;

    try {
      const response = await fetch('/api/droplets/destroy', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sessionId }),
      });

      if (response.ok) {
        fetchSessions(); // Refresh the list
      } else {
        throw new Error('Failed to destroy session');
      }
    } catch (error) {
      console.error('[destroySession] Error:', error);
      alert(`Failed to destroy session: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  };

  const startSessionForIssue = async (issue: Issue, repo: Repo) => {
    setIsProvisioning(true);

    try {
      const response = await fetch('/api/droplets/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          repoUrl: `https://github.com/${repo.full_name}.git`,
          repoName: repo.name,
          issueNumber: issue.number,
          branchName: `issue-${issue.number}`,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to create droplet');
      }

      const result = await response.json();
      console.log('[startSessionForIssue] Droplet created:', result);

      // Redirect to terminal
      window.location.href = `/terminal/${result.sessionId}?ip=${result.ip}`;
    } catch (error) {
      console.error('[startSessionForIssue] Error:', error);
      alert(`Failed to start session: ${error instanceof Error ? error.message : 'Unknown error'}`);
      setIsProvisioning(false);
    }
  };

  const createIssue = async () => {
    if (!selectedRepo || !newIssueTitle.trim()) return;

    setCreatingIssue(true);
    try {
      const token = localStorage.getItem('github_token');
      const response = await fetch(`https://api.github.com/repos/${selectedRepo.full_name}/issues`, {
        method: 'POST',
        headers: {
          'Authorization': `token ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: newIssueTitle,
          body: newIssueBody || undefined,
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('[createIssue] Failed:', response.status, errorText);
        throw new Error('Failed to create issue');
      }

      const newIssue = await response.json();
      console.log('[createIssue] Created issue:', newIssue.number);

      // Close modal and show polling state
      setShowCreateIssue(false);
      setNewIssueTitle('');
      setNewIssueBody('');
      setPollingForNewIssue(true);

      // Poll for the new issue (GitHub API can be eventually consistent)
      const maxAttempts = 10;
      const delayMs = 500;
      let found = false;

      for (let attempt = 1; attempt <= maxAttempts; attempt++) {
        console.log(`[createIssue] Poll attempt ${attempt}/${maxAttempts}...`);

        await new Promise(resolve => setTimeout(resolve, delayMs));

        const token = localStorage.getItem('github_token');
        const res = await fetch(`https://api.github.com/repos/${selectedRepo.full_name}/issues?state=open`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (res.ok) {
          const issueData = await res.json();
          console.log(`[createIssue] Found ${issueData.length} issues`);

          // Check if our new issue is in the list
          if (issueData.some((issue: Issue) => issue.number === newIssue.number)) {
            console.log('[createIssue] New issue found!');
            setIssues(issueData);
            found = true;
            break;
          }
        }
      }

      if (!found) {
        console.warn('[createIssue] Polling timed out, doing final refresh');
        await fetchIssues(selectedRepo);
      }

      setPollingForNewIssue(false);
    } catch (err) {
      console.error('Error creating issue:', err);
      alert('Failed to create issue. Please try again.');
    } finally {
      setCreatingIssue(false);
    }
  };

  const visibleRepos = repos.filter(r => !hiddenRepos.has(r.id));
  const displayRepos = manageMode ? repos : visibleRepos;

  // Loading state
  if (loading) {
    return (
      <div className="fixed inset-0 w-screen h-screen bg-[rgb(var(--color-orange))] flex items-center justify-center">
        <div className="text-9xl animate-spin-slow">⚡</div>
      </div>
    );
  }

  // Not connected to GitHub
  if (!user) {
    return (
      <div className="fixed inset-0 w-screen h-screen bg-[rgb(var(--color-orange))] overflow-hidden">
        <div className="h-full flex flex-col items-center justify-center p-6 safe-area-inset max-w-4xl mx-auto w-full">
          {/* Logo/Header */}
          <div className="card-yellow shadow-retro-xl p-8 mb-8 text-center">
            <div className="mb-4 flex justify-center">
              <HomeIcon className="w-12 h-12" />
            </div>
            <h1 className="text-5xl text-[rgb(var(--color-black))] mb-2 font-black">HOMESTEAD</h1>
            <p className="text-xl text-[rgb(var(--color-black))]">BUILD ANYWHERE</p>
          </div>

          {/* Connect Button */}
          <button
            onClick={connectGitHub}
            className="card-white shadow-retro-xl p-6 active:translate-x-4 active:translate-y-4 active:shadow-none transition-all"
          >
            <div className="flex items-center gap-4">
              <LinkIcon className="w-8 h-8" />
              <span className="text-3xl text-[rgb(var(--color-black))]">
                CONNECT GITHUB
              </span>
            </div>
          </button>

          <p className="text-2xl text-[rgb(var(--color-black))] font-black mt-12 text-center">
            Tend your digital homestead
          </p>
        </div>
      </div>
    );
  }

  // Issue detail view
  // Show issue detail if we have the issue, OR if URL says we should (while loading)
  if (selectedIssue || (selectedIssueNumber && selectedRepo)) {
    // If URL has issue number but we don't have the issue yet, show loading
    if (!selectedIssue) {
      return (
        <div className="fixed inset-0 w-screen h-screen bg-[rgb(var(--color-orange))] flex items-center justify-center">
          <div className="card-white shadow-retro-xl p-8">
            <div className="text-3xl font-black text-center">Loading issue...</div>
          </div>
        </div>
      );
    }
    console.log('[Issue Detail] selectedIssue:', selectedIssue);
    console.log('[Issue Detail] body:', selectedIssue.body);
    console.log('[Issue Detail] body type:', typeof selectedIssue.body);
    console.log('[Issue Detail] has body?', !!selectedIssue.body);

    return (
      <div className="fixed inset-0 w-screen h-screen bg-[rgb(var(--color-orange))] overflow-y-auto">
        <div className="min-h-full flex flex-col p-6 safe-area-inset max-w-4xl mx-auto">
          {/* Back Button */}
          <button
            onClick={() => {
              if (selectedRepo) {
                router.push(`/?repo=${encodeURIComponent(selectedRepo.full_name)}`);
              } else {
                router.push('/');
              }
              setExistingSession(null);
            }}
            className="card-yellow shadow-retro-lg p-3 mb-4 active:translate-x-2 active:translate-y-2 active:shadow-none transition-all"
          >
            <ChevronLeftIcon className="w-6 h-6" />
          </button>

          {/* Issue Header */}
          <div className="card-white shadow-retro-xl p-6 mb-4">
            <div className="flex items-start gap-3 mb-3">
              {selectedIssue.labels.some(l => l.name.includes('bug')) ? (
                <BugIcon className="w-8 h-8 flex-shrink-0" />
              ) : selectedIssue.labels.some(l => l.name.includes('feature')) ? (
                <LightbulbIcon className="w-8 h-8 flex-shrink-0" />
              ) : (
                <CodeIcon className="w-8 h-8 flex-shrink-0" />
              )}
              <div className="flex-1">
                <h1 className="text-xl text-[rgb(var(--color-black))] font-black mb-1">
                  #{selectedIssue.number}
                </h1>
                <h2 className="text-2xl text-[rgb(var(--color-black))] font-black leading-tight">
                  {selectedIssue.title}
                </h2>
              </div>
            </div>

            {/* Issue Description */}
            <div className="mt-6 pt-6 border-t-4 border-[rgb(var(--color-black))]">
              <h3 className="text-xl text-[rgb(var(--color-black))] font-black mb-3">
                DESCRIPTION
              </h3>
              {selectedIssue.body ? (
                <div className="text-lg text-[rgb(var(--color-black))] font-bold whitespace-pre-wrap leading-relaxed">
                  {selectedIssue.body}
                </div>
              ) : (
                <div className="text-lg text-[rgb(var(--color-black))]/60 font-bold italic">
                  No description provided
                </div>
              )}
            </div>
          </div>

          {/* View on GitHub Button */}
          <a
            href={selectedIssue.html_url}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full card-yellow shadow-retro-lg p-4 mb-4 active:translate-x-2 active:translate-y-2 active:shadow-none transition-all block text-center"
          >
            <div className="flex items-center justify-center gap-3">
              <LinkIcon className="w-6 h-6" />
              <span className="text-xl text-[rgb(var(--color-black))] font-black">VIEW ON GITHUB</span>
            </div>
          </a>

          {/* Session Button - Rejoin or Start */}
          {checkingSession ? (
            <div className="w-full card-white shadow-retro-xl p-8">
              <div className="flex items-center justify-center gap-3">
                <ReloadIcon className="w-8 h-8 animate-spin" />
                <span className="text-2xl text-[rgb(var(--color-black))] font-black">
                  CHECKING SESSION...
                </span>
              </div>
            </div>
          ) : !isProvisioning ? (
            existingSession ? (
              <a
                href={`/terminal/${existingSession.sessionId}?ip=${existingSession.ip}`}
                className="w-full card-yellow shadow-retro-xl p-8 active:translate-x-4 active:translate-y-4 active:shadow-none transition-all block"
              >
                <div className="flex flex-col items-center gap-4">
                  <TerminalIcon className="w-16 h-16" />
                  <span className="text-4xl text-[rgb(var(--color-black))] leading-none font-black text-center">
                    REJOIN SESSION
                  </span>
                  <span className="text-lg text-[rgb(var(--color-black))]/70 font-bold">
                    Active session found!
                  </span>
                </div>
              </a>
            ) : (
              <button
                onClick={() => selectedRepo && startSessionForIssue(selectedIssue, selectedRepo)}
                className="w-full card-green shadow-retro-xl p-8 active:translate-x-4 active:translate-y-4 active:shadow-none transition-all"
              >
                <div className="flex flex-col items-center gap-4">
                  <ZapIcon className="w-16 h-16" />
                  <span className="text-4xl text-[rgb(var(--color-black))] leading-none font-black">
                    START SESSION
                  </span>
                </div>
              </button>
            )
          ) : (
            <div className="card-white shadow-retro-xl p-6">
              <div className="text-center mb-6">
                <div className="mb-4 flex justify-center">
                  <ReloadIcon className="w-12 h-12 animate-spin-slow" />
                </div>
                <h2 className="text-3xl text-[rgb(var(--color-black))] mb-2 font-black">
                  PROVISIONING...
                </h2>
                <p className="text-lg text-[rgb(var(--color-black))]/60 font-bold">
                  ~3 MIN
                </p>
              </div>

              {/* Progress Steps */}
              <div className="space-y-4">
                {[
                  { label: 'CREATE DROPLET', done: true },
                  { label: 'CLONE REPO', done: false },
                  { label: 'INSTALL DEPS', done: false },
                  { label: 'START CLAUDE', done: false },
                ].map((step, i) => (
                  <div key={i} className="flex items-center gap-4">
                    <div className={`w-10 h-10 border-4 border-[rgb(var(--color-black))] flex items-center justify-center transition-all ${
                      step.done
                        ? 'bg-[rgb(var(--color-green))] scale-100'
                        : 'bg-[rgb(var(--color-white))] scale-90'
                    }`}>
                      {step.done ? <CheckIcon className="w-6 h-6" /> : <ReloadIcon className="w-5 h-5 animate-spin-slow" />}
                    </div>
                    <span className="text-xl font-black text-[rgb(var(--color-black))]">
                      {step.label}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  // Issues list view
  // Show issues list if we have the repo, OR if URL says we should (while loading)
  if (selectedRepo || (selectedRepoName && !selectedIssueNumber)) {
    // If URL has repo but we don't have it yet, show loading
    if (!selectedRepo) {
      return (
        <div className="fixed inset-0 w-screen h-screen bg-[rgb(var(--color-orange))] flex items-center justify-center">
          <div className="card-white shadow-retro-xl p-8">
            <div className="text-3xl font-black text-center">Loading repo...</div>
          </div>
        </div>
      );
    }
    return (
      <div className="fixed inset-0 w-screen h-screen bg-[rgb(var(--color-orange))] overflow-y-auto">
        <div className="min-h-full flex flex-col p-6 safe-area-inset max-w-4xl mx-auto">
          {/* Back Button */}
          <button
            onClick={() => {
              router.push('/');
              setIssues([]);
            }}
            className="card-yellow shadow-retro-lg p-3 mb-4 active:translate-x-2 active:translate-y-2 active:shadow-none transition-all"
          >
            <ChevronLeftIcon className="w-6 h-6" />
          </button>

          {/* Repo Header */}
          <div className="card-white shadow-retro-xl p-6 mb-4">
            <h1 className="text-3xl text-[rgb(var(--color-black))] leading-tight mb-2 font-black">
              {selectedRepo.name}
            </h1>
            <p className="text-lg text-[rgb(var(--color-black))]/60 font-bold">
              {selectedRepo.owner.login}
            </p>
          </div>

          {/* Create Issue Button */}
          <button
            onClick={() => setShowCreateIssue(true)}
            className="w-full card-yellow shadow-retro-lg p-4 mb-4 active:translate-x-2 active:translate-y-2 active:shadow-none transition-all"
          >
            <div className="flex items-center justify-center gap-3">
              <PlusIcon className="w-6 h-6" />
              <span className="text-xl text-[rgb(var(--color-black))] font-black">CREATE ISSUE</span>
            </div>
          </button>

          {/* Polling Indicator */}
          {pollingForNewIssue && (
            <div className="card-white shadow-retro-xl p-6 mb-4 animate-pulse">
              <div className="flex items-center justify-center gap-3">
                <ReloadIcon className="w-8 h-8 animate-spin" />
                <div>
                  <p className="text-2xl text-[rgb(var(--color-black))] font-black">
                    CREATING ISSUE...
                  </p>
                  <p className="text-lg text-[rgb(var(--color-black))]/60 font-bold">
                    Waiting for GitHub to sync
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Issues */}
          <div className="space-y-6 pb-6">
            {issues.length === 0 ? (
              <div className="card-white shadow-retro-xl p-12 text-center">
                <p className="text-4xl text-[rgb(var(--color-black))] font-black">
                  NO ISSUES YET
                </p>
                <p className="text-2xl text-[rgb(var(--color-black))]/60 font-bold mt-4">
                  Create one above!
                </p>
              </div>
            ) : (
              issues.map((issue) => (
                <button
                  key={issue.id}
                  onClick={() => {
                    if (selectedRepo) {
                      router.push(`/?repo=${encodeURIComponent(selectedRepo.full_name)}&issue=${issue.number}`);
                      checkForExistingSession(selectedRepo.name, issue.number);
                    }
                  }}
                  className="w-full card-white shadow-retro-lg p-4 active:translate-x-2 active:translate-y-2 active:shadow-none transition-all text-left"
                >
                  <div className="flex items-center gap-3">
                    {issue.labels.some(l => l.name.includes('bug')) ? (
                      <BugIcon className="w-8 h-8 flex-shrink-0" />
                    ) : issue.labels.some(l => l.name.includes('feature')) ? (
                      <LightbulbIcon className="w-8 h-8 flex-shrink-0" />
                    ) : (
                      <CodeIcon className="w-8 h-8 flex-shrink-0" />
                    )}
                    <div className="flex-1 min-w-0">
                      <div className="text-xl font-black text-[rgb(var(--color-black))] leading-tight">
                        #{issue.number}
                      </div>
                      <div className="text-base text-[rgb(var(--color-black))] font-bold leading-tight truncate">
                        {issue.title}
                      </div>
                    </div>
                  </div>
                </button>
              ))
            )}
          </div>

          {/* Create Issue Modal */}
          {showCreateIssue && (
            <div className="fixed inset-0 bg-black/80 flex items-center justify-center p-6 z-50">
              <div className="card-white shadow-retro-xl p-6 max-w-2xl w-full max-h-[80vh] overflow-y-auto">
                <h2 className="text-3xl text-[rgb(var(--color-black))] font-black mb-6">
                  CREATE NEW ISSUE
                </h2>

                {/* Title Input */}
                <div className="mb-4">
                  <label className="block text-xl text-[rgb(var(--color-black))] font-black mb-2">
                    TITLE
                  </label>
                  <input
                    type="text"
                    value={newIssueTitle}
                    onChange={(e) => setNewIssueTitle(e.target.value)}
                    className="w-full p-3 border-4 border-[rgb(var(--color-black))] text-xl font-bold"
                    placeholder="Issue title..."
                    autoFocus
                  />
                </div>

                {/* Body Textarea */}
                <div className="mb-6">
                  <label className="block text-xl text-[rgb(var(--color-black))] font-black mb-2">
                    DESCRIPTION
                  </label>
                  <textarea
                    value={newIssueBody}
                    onChange={(e) => setNewIssueBody(e.target.value)}
                    className="w-full p-3 border-4 border-[rgb(var(--color-black))] text-lg font-bold min-h-[200px]"
                    placeholder="Describe the issue... (optional)"
                  />
                </div>

                {/* Buttons */}
                <div className="flex gap-3">
                  <button
                    onClick={createIssue}
                    disabled={!newIssueTitle.trim() || creatingIssue}
                    className="flex-1 card-yellow shadow-retro-lg p-4 active:translate-x-2 active:translate-y-2 active:shadow-none transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <span className="text-xl text-[rgb(var(--color-black))] font-black">
                      {creatingIssue ? 'CREATING...' : 'CREATE'}
                    </span>
                  </button>
                  <button
                    onClick={() => {
                      setShowCreateIssue(false);
                      setNewIssueTitle('');
                      setNewIssueBody('');
                    }}
                    disabled={creatingIssue}
                    className="flex-1 card-white shadow-retro-lg p-4 active:translate-x-2 active:translate-y-2 active:shadow-none transition-all disabled:opacity-50"
                  >
                    <span className="text-xl text-[rgb(var(--color-black))] font-black">
                      CANCEL
                    </span>
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  // Sessions view
  if (showSessions) {
    return (
      <div className="fixed inset-0 w-screen h-screen bg-[rgb(var(--color-orange))] overflow-y-auto">
        <div className="min-h-full flex flex-col p-6 safe-area-inset max-w-4xl mx-auto">
          {/* Back Button */}
          <button
            onClick={() => setShowSessions(false)}
            className="card-yellow shadow-retro-lg p-3 mb-4 active:translate-x-2 active:translate-y-2 active:shadow-none transition-all"
          >
            <ChevronLeftIcon className="w-6 h-6" />
          </button>

          {/* Header */}
          <div className="card-white shadow-retro-xl p-6 mb-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <TerminalIcon className="w-8 h-8" />
                <h1 className="text-3xl text-[rgb(var(--color-black))] font-black leading-tight">
                  ACTIVE SESSIONS
                </h1>
              </div>
              <button
                onClick={fetchSessions}
                className="p-2 active:translate-x-1 active:translate-y-1 transition-all"
                title="Refresh"
              >
                <ReloadIcon className="w-6 h-6" />
              </button>
            </div>
          </div>

          {/* Sessions List */}
          <div className="space-y-4 pb-6">
            {sessions.length === 0 ? (
              <div className="card-white shadow-retro-xl p-12 text-center">
                <p className="text-4xl text-[rgb(var(--color-black))] font-black">
                  NO ACTIVE SESSIONS
                </p>
                <p className="text-2xl text-[rgb(var(--color-black))]/60 font-bold mt-4">
                  Start a session from an issue!
                </p>
              </div>
            ) : (
              sessions.map((session) => (
                <div key={session.sessionId} className="card-white shadow-retro-lg p-4">
                  <div className="mb-3">
                    <h3 className="text-xl text-[rgb(var(--color-black))] font-black mb-1">
                      {session.repoName}
                    </h3>
                    {session.issueNumber && (
                      <p className="text-lg text-[rgb(var(--color-black))]/70 font-bold">
                        Issue #{session.issueNumber}
                      </p>
                    )}
                    <p className="text-sm text-[rgb(var(--color-black))]/50 font-bold mt-1">
                      {session.sessionId}
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <a
                      href={`/terminal/${session.sessionId}?ip=${session.ip}`}
                      className="card-green shadow-retro p-3 active:translate-x-1 active:translate-y-1 active:shadow-none transition-all block text-center"
                    >
                      <div className="flex items-center justify-center gap-2">
                        <TerminalIcon className="w-5 h-5" />
                        <span className="text-lg text-[rgb(var(--color-black))] font-black">
                          REJOIN
                        </span>
                      </div>
                    </a>

                    <button
                      onClick={() => destroySession(session.sessionId)}
                      className="card-red shadow-retro p-3 active:translate-x-1 active:translate-y-1 active:shadow-none transition-all"
                    >
                      <div className="flex items-center justify-center gap-2">
                        <TrashIcon className="w-5 h-5" />
                        <span className="text-lg text-[rgb(var(--color-black))] font-black">
                          DESTROY
                        </span>
                      </div>
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    );
  }

  // Repos list view
  return (
    <div className="fixed inset-0 w-screen h-screen bg-[rgb(var(--color-orange))] overflow-y-auto">
      <div className="min-h-full flex flex-col p-6 safe-area-inset max-w-4xl mx-auto">
        {/* Header with user */}
        <div className="card-yellow shadow-retro-xl p-6 mb-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <HomeIcon className="w-8 h-8" />
              <div>
                <h1 className="text-3xl text-[rgb(var(--color-black))] font-black leading-tight">HOMESTEAD</h1>
                <p className="text-lg text-[rgb(var(--color-black))]">{user.name || user.login}</p>
              </div>
            </div>
            <button
              onClick={disconnect}
              className="p-2 active:translate-x-1 active:translate-y-1 transition-all"
              title="Disconnect"
            >
              <PowerIcon className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-2 gap-4 mb-4">
          <button
            onClick={() => setManageMode(!manageMode)}
            className="card-white shadow-retro-lg p-4 active:translate-x-2 active:translate-y-2 active:shadow-none transition-all"
          >
            <div className="flex items-center justify-center gap-3">
              {manageMode ? <CheckIcon className="w-6 h-6" /> : <SlidersIcon className="w-6 h-6" />}
              <span className="text-xl text-[rgb(var(--color-black))] font-black">
                {manageMode ? 'DONE' : 'REPOS'}
              </span>
            </div>
          </button>

          <button
            onClick={() => {
              setShowSessions(true);
              fetchSessions();
            }}
            className="card-green shadow-retro-lg p-4 active:translate-x-2 active:translate-y-2 active:shadow-none transition-all"
          >
            <div className="flex items-center justify-center gap-3">
              <TerminalIcon className="w-6 h-6" />
              <span className="text-xl text-[rgb(var(--color-black))] font-black">
                SESSIONS
              </span>
            </div>
          </button>
        </div>

        {/* Repos */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pb-8">
          {displayRepos.length === 0 ? (
            <div className="card-white shadow-retro-xl p-12 text-center">
              <p className="text-4xl text-[rgb(var(--color-black))] font-black">
                {repos.length === 0 ? 'NO REPOS FOUND' : 'ALL REPOS HIDDEN'}
              </p>
              {repos.length > 0 && (
                <p className="text-2xl text-[rgb(var(--color-black))]/60 font-bold mt-4">
                  Click MANAGE REPOS to show
                </p>
              )}
            </div>
          ) : (
            displayRepos.map((repo) => {
              const isHidden = hiddenRepos.has(repo.id);

              return (
                  <button
                    key={repo.id}
                    onClick={() => {
                      if (manageMode) {
                        toggleHideRepo(repo.id);
                      } else {
                        fetchIssues(repo);
                      }
                    }}
                    className={`card-white shadow-retro-lg p-4 active:translate-x-2 active:translate-y-2 active:shadow-none transition-all text-left ${
                      manageMode && isHidden ? 'opacity-40' : ''
                    }`}
                  >
                    <div className="flex items-center justify-between gap-3">
                      <div className="flex items-center gap-3 min-w-0 flex-1">
                        {manageMode && (
                          <div className={`w-8 h-8 border-4 border-[rgb(var(--color-black))] flex items-center justify-center flex-shrink-0 ${
                            isHidden ? 'bg-white' : 'bg-[rgb(var(--color-green))]'
                          }`}>
                            {!isHidden && <CheckIcon className="w-5 h-5" />}
                          </div>
                        )}
                        <div className="min-w-0">
                          <div className="text-2xl font-black text-[rgb(var(--color-black))] truncate">
                            {repo.name}
                          </div>
                          <div className="text-sm text-[rgb(var(--color-black))]/60 font-bold truncate">
                            {repo.owner.login}
                          </div>
                        </div>
                      </div>
                      {!manageMode && (
                        <div className="card-yellow shadow-retro px-3 py-2 flex-shrink-0">
                          <span className="text-xl font-black text-[rgb(var(--color-black))]">
                            {repo.open_issues_count}
                          </span>
                        </div>
                      )}
                    </div>
                  </button>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
