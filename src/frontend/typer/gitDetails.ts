export interface GitDetails {
    frontend: GitInfo;
    backend: GitInfo;
}

export interface GitInfo {
    branchName: string;
    commitTime: string;
}
