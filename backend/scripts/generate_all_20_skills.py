"""
Complete 20 skills x 20 questions MCQ database for SkillNav.
Each question has 4 options, a 0-based correctIndex, and a detailed explanation.
"""

def build_complete_20_quizzes():
    from generate_20x20_quizzes import get_all_quizzes
    base_quizzes = get_all_quizzes() # contains 1 to 4: SQL, HTTP/REST, Databases, Cloud Basics

    # 5. Cloud storage & scaling
    q5 = {
        "id": "cloud-storage-scaling",
        "name": "Cloud storage & scaling",
        "displayName": "Cloud Storage & Scaling (Block, Object, Elastic Scaling)",
        "category": "Cloud & Infrastructure",
        "description": "Object vs block vs file storage, S3 buckets, horizontal/vertical scaling, auto-scaling groups, and load balancers.",
        "estimated_minutes": 20,
        "questions": [
            {
                "id": 1,
                "question": "Which storage type is Amazon S3, Azure Blob Storage, and Google Cloud Storage categorized as?",
                "options": ["Block Storage", "Object Storage", "File Storage (NFS)", "Direct-Attached RAM"],
                "correctIndex": 1,
                "explanation": "Object storage stores data as discrete objects with metadata and a globally unique key, accessible via HTTP/REST APIs."
            },
            {
                "id": 2,
                "question": "What is the primary difference between Block Storage (e.g. AWS EBS) and Object Storage (e.g. AWS S3)?",
                "options": [
                    "Block storage behaves like a raw unformatted physical hard disk attachable to a single VM; Object storage stores complete immutable objects accessible over HTTP.",
                    "Block storage cannot be partitioned.",
                    "Object storage is only suitable for running operating system boot disks.",
                    "Block storage has infinite automatic global replication across all continents."
                ],
                "correctIndex": 0,
                "explanation": "Block storage is mounted as virtual disk blocks for operating systems and databases; object storage is flat, infinitely scalable HTTP-accessible storage."
            },
            {
                "id": 3,
                "question": "What is Vertical Scaling (Scaling Up)?",
                "options": [
                    "Adding more compute power (CPU, RAM, GPU) to an existing single server instance.",
                    "Adding more servers into an auto-scaling cluster.",
                    "Storing files vertically on disk tracks.",
                    "Connecting servers with taller Ethernet cables."
                ],
                "correctIndex": 0,
                "explanation": "Vertical scaling increases the capacity of an individual server instance, up to physical hardware limits."
            },
            {
                "id": 4,
                "question": "What is Horizontal Scaling (Scaling Out)?",
                "options": [
                    "Adding more server instances to distribute workload across a fleet.",
                    "Upgrading a single VM from 4 CPU cores to 64 CPU cores.",
                    "Formatting disks with wider sectors.",
                    "Decreasing network bandwidth to reduce latency."
                ],
                "correctIndex": 0,
                "explanation": "Horizontal scaling adds more instances of a resource (e.g., adding 5 more web servers behind a load balancer)."
            },
            {
                "id": 5,
                "question": "What is the primary purpose of an Application Load Balancer (ALB) operating at Layer 7?",
                "options": [
                    "Distributing incoming HTTP/HTTPS traffic based on request headers, path routes, and methods across a target group of servers.",
                    "Compressing video files before saving to disk.",
                    "Providing physical electricity to server racks.",
                    "Enforcing SQL primary key uniqueness."
                ],
                "correctIndex": 0,
                "explanation": "Layer 7 load balancers inspect application-layer HTTP traffic to route requests intelligently by URL path, host header, or query parameters."
            },
            {
                "id": 6,
                "question": "What does an Auto-Scaling Group (ASG) do in cloud architecture?",
                "options": [
                    "Automatically launches or terminates VM instances based on defined metrics like CPU utilization or request count.",
                    "Automatically increases font size on web pages.",
                    "Purchases new hardware from vendors via credit card.",
                    "Forces all database tables to double their row count."
                ],
                "correctIndex": 0,
                "explanation": "Auto-scaling groups monitor metrics (e.g. CPU > 70%) to automatically scale capacity in or out, ensuring availability and cost efficiency."
            },
            {
                "id": 7,
                "question": "What is a Content Delivery Network (CDN) used for?",
                "options": [
                    "Caching static and dynamic web content on geographically distributed edge servers close to end users to reduce latency.",
                    "Running relational database transactions.",
                    "Generating cryptographic private keys.",
                    "Creating physical backups on tape drives."
                ],
                "correctIndex": 0,
                "explanation": "CDNs (e.g. Cloudflare, AWS CloudFront) cache assets near users geographically to dramatically speed up content delivery."
            },
            {
                "id": 8,
                "question": "What is the typical durability guarantee of standard Amazon S3 storage class?",
                "options": ["99.999999999% (11 9's)", "99.9%", "95.0%", "90.0%"],
                "correctIndex": 0,
                "explanation": "S3 standard provides 99.999999999% annual durability by redundantly storing objects across multiple physical devices and availability zones."
            },
            {
                "id": 9,
                "question": "When should 'Cold Storage' or 'Archive Storage' (e.g., S3 Glacier) be selected?",
                "options": [
                    "For infrequently accessed data that requires long-term retention (e.g., compliance records) where retrieval delay of minutes/hours is acceptable.",
                    "For high-speed database transaction log files updated 1,000 times per second.",
                    "For delivering live video streaming to mobile apps.",
                    "For running live web server operating systems."
                ],
                "correctIndex": 0,
                "explanation": "Cold/Archive storage offers extremely low storage cost in exchange for longer retrieval times (minutes to hours)."
            },
            {
                "id": 10,
                "question": "What is a Stateless Application Architecture in horizontal scaling?",
                "options": [
                    "Application servers do not store client session data locally, allowing any incoming request to be handled by any server instance.",
                    "The application contains no business logic.",
                    "The app cannot interact with a database.",
                    "The code has no variable declarations."
                ],
                "correctIndex": 0,
                "explanation": "Stateless servers store session state externally (e.g. in Redis or client JWTs), making horizontal scaling simple and seamless."
            },
            {
                "id": 11,
                "question": "What does a Load Balancer 'Health Check' do?",
                "options": [
                    "Periodically probes target server endpoints (e.g. GET /health) and stops routing traffic to instances that fail to respond correctly.",
                    "Measures physical room temperature in data centers.",
                    "Checks the operating system license expiration date.",
                    "Validates the grammar of web page text."
                ],
                "correctIndex": 0,
                "explanation": "Health checks ensure traffic is only routed to healthy, responsive instances, automatically bypassing failing nodes."
            },
            {
                "id": 12,
                "question": "What is the role of File Storage (e.g. AWS EFS, Azure Files, NFS) in the cloud?",
                "options": [
                    "Shared file system storage that can be mounted concurrently by multiple virtual machines over the network.",
                    "Storage limited strictly to single-core CPUs.",
                    "Direct-attached RAM disk for graphics cards.",
                    "A local browser cookie storage engine."
                ],
                "correctIndex": 0,
                "explanation": "Network File Storage (NFS/SMB) provides hierarchical file system access shareable simultaneously across multiple compute nodes."
            },
            {
                "id": 13,
                "question": "What is Edge Computing?",
                "options": [
                    "Deploying compute workloads geographically closer to the data source or end user to minimize network round-trip latency.",
                    "Using only the edges of physical circuit boards.",
                    "Writing code on the borders of terminal windows.",
                    "A technique exclusive to satellite communication."
                ],
                "correctIndex": 0,
                "explanation": "Edge computing processes data near the network edge where things or people produce and consume that data."
            },
            {
                "id": 14,
                "question": "What is Storage Tiering (Lifecycle Management)?",
                "options": [
                    "Automatically migrating objects to cheaper storage tiers (e.g., from Standard to Infrequent Access to Archive) as data ages.",
                    "Formatting hard drives into tiers of physical sectors.",
                    "Purchasing storage subscriptions in 3-year increments.",
                    "Encrypting files with multi-tier passwords."
                ],
                "correctIndex": 0,
                "explanation": "Lifecycle rules automatically transition objects between storage tiers based on age to optimize cloud storage expenditure."
            },
            {
                "id": 15,
                "question": "What is a major challenge when scaling a Stateful application horizontally?",
                "options": [
                    "Maintaining synchronized persistent state and session consistency across all running nodes.",
                    "Writing CSS code.",
                    "Connecting servers to the internet.",
                    "Creating user accounts in Git."
                ],
                "correctIndex": 0,
                "explanation": "Stateful systems (like distributed databases) must coordinate consensus, replication, and data locking across all nodes."
            },
            {
                "id": 16,
                "question": "What is Elastic Block Store (EBS) snapshotting?",
                "options": [
                    "Point-in-time incremental backups of a block storage volume saved into object storage (S3).",
                    "A camera photograph of a physical server rack.",
                    "A screenshot of a terminal window.",
                    "A temporary cache in browser memory."
                ],
                "correctIndex": 0,
                "explanation": "Snapshots provide incremental point-in-time volume backups, copying only the blocks that changed since the last snapshot."
            },
            {
                "id": 17,
                "question": "What is a Sticky Session (Session Affinity) on a load balancer?",
                "options": [
                    "Routing all requests from a specific client to the same backend server instance for the duration of a session.",
                    "Preventing users from logging out of an application.",
                    "A session that permanently locks server CPU.",
                    "A network protocol used for hardware testing."
                ],
                "correctIndex": 0,
                "explanation": "Sticky sessions bind a user's session to a specific instance, often used as a workaround for legacy stateful applications."
            },
            {
                "id": 18,
                "question": "What is Network Attached Storage (NAS)?",
                "options": [
                    "File-level computer data storage connected to a computer network providing data access to a heterogeneous group of clients.",
                    "An internal motherboard bus connecting CPU to RAM.",
                    "A wireless router with no hard drive.",
                    "A direct optical cable between two satellites."
                ],
                "correctIndex": 0,
                "explanation": "NAS provides file-level data access to networked clients using protocols such as NFS or SMB."
            },
            {
                "id": 19,
                "question": "What is Storage Encryption at Rest?",
                "options": [
                    "Encrypting data while it is stored on physical media (disks, tapes, flash) to prevent unauthorized access if the media is compromised.",
                    "Encrypting data only when transmitted over HTTPS cables.",
                    "Deleting data when a computer enters sleep mode.",
                    "Compressing files to reduce disk size."
                ],
                "correctIndex": 0,
                "explanation": "Encryption at rest safeguards data stored on disks using algorithms like AES-256 with managed cryptographic keys."
            },
            {
                "id": 20,
                "question": "What is Cross-Region Replication (CRR) in object storage?",
                "options": [
                    "Automatically copying uploaded objects across buckets in different geographic regions for disaster recovery and compliance.",
                    "Copying files across folders on the same computer.",
                    "Renaming files every hour.",
                    "Sending database queries across two terminal windows."
                ],
                "correctIndex": 0,
                "explanation": "CRR asynchronously replicates objects across different geographic cloud regions for low-latency multi-region access and disaster recovery."
            }
        ]
    }

    # 6. Linux basics
    q6 = {
        "id": "linux-basics",
        "name": "Linux basics",
        "displayName": "Linux Operating System & Command Line Fundamentals",
        "category": "Operating Systems & DevOps",
        "description": "Permissions (chmod), process management, file inspection, piping, redirection, environment variables, and shell navigation.",
        "estimated_minutes": 20,
        "questions": [
            {
                "id": 1,
                "question": "What does the command 'chmod 755 script.sh' accomplish?",
                "options": [
                    "Grants Read/Write/Execute to Owner (7), and Read/Execute to Group (5) and Others (5).",
                    "Grants all permissions to everyone in the world.",
                    "Deletes the file permanently after 755 seconds.",
                    "Encrypts the script with a 755-bit key."
                ],
                "correctIndex": 0,
                "explanation": "7 (4+2+1=rwx) for owner, 5 (4+0+1=r-x) for group, 5 (r-x) for others."
            },
            {
                "id": 2,
                "question": "Which command is used to view active running processes in real-time with continuous updates?",
                "options": ["top / htop", "cat processes", "ps -once", "show all"],
                "correctIndex": 0,
                "explanation": "top (and htop) provides a dynamic real-time view of running system processes, CPU, and memory utilization."
            },
            {
                "id": 3,
                "question": "What is the difference between '>' and '>>' in Linux shell redirection?",
                "options": [
                    "'>' overwrites the destination file; '>>' appends output to the end of the destination file.",
                    "'>' appends; '>>' deletes the file.",
                    "'>' redirects standard error; '>>' redirects standard input.",
                    "There is no difference between them."
                ],
                "correctIndex": 0,
                "explanation": "'>' truncates/overwrites the target file with stdout; '>>' appends stdout to the file."
            },
            {
                "id": 4,
                "question": "Which command searches for a specific text pattern inside files using regular expressions?",
                "options": ["grep", "find", "locate", "cat"],
                "correctIndex": 0,
                "explanation": "grep (Global Regular Expression Print) searches text and prints matching lines."
            },
            {
                "id": 5,
                "question": "What does the pipe operator '|' do in Linux?",
                "options": [
                    "Redirects the standard output (stdout) of the preceding command into the standard input (stdin) of the succeeding command.",
                    "Executes both commands in parallel background threads.",
                    "Compares two files for textual equality.",
                    "Deletes intermediate error logs."
                ],
                "correctIndex": 0,
                "explanation": "Piping connects the output stream of one program directly into the input stream of another without writing to disk."
            },
            {
                "id": 6,
                "question": "What does the command 'kill -9 <PID>' do?",
                "options": [
                    "Sends the SIGKILL signal to immediately and forcefully terminate the process without cleanup.",
                    "Gracefully asks the process to exit after saving state (SIGTERM).",
                    "Pauses the process for 9 minutes.",
                    "Restarts the process with 9 threads."
                ],
                "correctIndex": 0,
                "explanation": "Signal 9 (SIGKILL) cannot be caught or ignored by a process, causing an immediate kernel termination."
            },
            {
                "id": 7,
                "question": "Which directory in standard Linux hierarchy holds global system configuration files?",
                "options": ["/etc", "/var", "/bin", "/tmp"],
                "correctIndex": 0,
                "explanation": "/etc contains configuration files and directories essential for system administration and daemon settings."
            },
            {
                "id": 8,
                "question": "What is the purpose of the 'sudo' command?",
                "options": [
                    "Executing a command with the security privileges of another user (by default, the superuser/root).",
                    "Switching the monitor resolution.",
                    "Downloading software packages from the web.",
                    "Rebooting the kernel immediately."
                ],
                "correctIndex": 0,
                "explanation": "sudo ('superuser do') permits authorized users to execute commands with elevated root security privileges."
            },
            {
                "id": 9,
                "question": "How do you view the last 50 lines of an application log file and keep following new incoming entries in real-time?",
                "options": ["tail -n 50 -f app.log", "head -n 50 app.log", "cat app.log -follow", "less app.log --top"],
                "correctIndex": 0,
                "explanation": "tail -f (or --follow) outputs appended data as the file grows; -n 50 specifies starting from the last 50 lines."
            },
            {
                "id": 10,
                "question": "What does 'chown user:group filename' do?",
                "options": [
                    "Changes the user owner and group owner of the specified file.",
                    "Changes file read/write permissions.",
                    "Renames the file to user:group.",
                    "Encrypts the file."
                ],
                "correctIndex": 0,
                "explanation": "chown (change owner) modifies the user and/or group ownership of filesystem items."
            },
            {
                "id": 11,
                "question": "Which command displays current disk space usage in human-readable units (GB, MB)?",
                "options": ["df -h", "du -all", "free -m", "ls -disk"],
                "correctIndex": 0,
                "explanation": "df -h (disk filesystem -human readable) displays total, used, and available space on mounted filesystems."
            },
            {
                "id": 12,
                "question": "What does 'cron' do in Linux?",
                "options": [
                    "A time-based job scheduling daemon that executes configured commands and scripts at specified intervals.",
                    "A text editor for writing C code.",
                    "A hardware diagnostic tool for checking RAM.",
                    "A network packet sniffer."
                ],
                "correctIndex": 0,
                "explanation": "Cron runs scheduled tasks (crontabs) periodically at fixed times, dates, or intervals."
            },
            {
                "id": 13,
                "question": "How do you set a persistent environment variable 'API_PORT=8080' for a bash user across shell restarts?",
                "options": [
                    "Add 'export API_PORT=8080' to ~/.bashrc or ~/.bash_profile.",
                    "Type 'API_PORT=8080' in a temporary terminal and close it.",
                    "Create a file named /tmp/API_PORT.",
                    "Run 'chmod 8080 API_PORT'."
                ],
                "correctIndex": 0,
                "explanation": "Adding export KEY=VAL to ~/.bashrc ensures it is evaluated and loaded for every new interactive shell session."
            },
            {
                "id": 14,
                "question": "What does the command 'tar -czvf archive.tar.gz /path/to/folder' do?",
                "options": [
                    "Creates a gzip-compressed archive file of the specified folder.",
                    "Decompresses an existing zip file.",
                    "Deletes the folder after checking for viruses.",
                    "Uploads the folder to an FTP server."
                ],
                "correctIndex": 0,
                "explanation": "-c (create), -z (gzip), -v (verbose), -f (filename) packages and compresses a directory into an archive."
            },
            {
                "id": 15,
                "question": "What is the function of the command 'systemctl restart nginx'?",
                "options": [
                    "Restarts the Nginx systemd background service daemon.",
                    "Uninstalls Nginx from the operating system.",
                    "Changes Nginx server port to 80.",
                    "Reboots the physical machine."
                ],
                "correctIndex": 0,
                "explanation": "systemctl controls the systemd system and service manager to manage Linux background daemons."
            },
            {
                "id": 16,
                "question": "Which command creates a symbolic link (symlink) from target_file to link_name?",
                "options": ["ln -s target_file link_name", "link --sym target_file link_name", "cp --link target_file link_name", "alias target_file link_name"],
                "correctIndex": 0,
                "explanation": "ln -s creates a symbolic link that points to the target path without duplicating file data."
            },
            {
                "id": 17,
                "question": "What is standard error file descriptor number in Linux?",
                "options": ["2", "0 (stdin)", "1 (stdout)", "3"],
                "correctIndex": 0,
                "explanation": "0 is standard input (stdin), 1 is standard output (stdout), and 2 is standard error (stderr)."
            },
            {
                "id": 18,
                "question": "What does '2>&1' mean in a shell command like 'command > output.log 2>&1'?",
                "options": [
                    "Redirects standard error (2) into the same destination as standard output (1).",
                    "Multiplies output by 2.",
                    "Reverses the command order.",
                    "Sends command to background thread 2."
                ],
                "correctIndex": 0,
                "explanation": "2>&1 redirects file descriptor 2 (stderr) to file descriptor 1 (stdout), combining both streams into the output destination."
            },
            {
                "id": 19,
                "question": "Which command displays current memory (RAM) usage and swap space in megabytes?",
                "options": ["free -m", "mem -show", "ram -v", "top --ram"],
                "correctIndex": 0,
                "explanation": "free -m displays total, used, free, shared, and swap memory in megabytes."
            },
            {
                "id": 20,
                "question": "What does the command 'ssh-keygen -t ed25519' do?",
                "options": [
                    "Generates a modern, high-security Ed25519 public/private SSH key pair for passwordless authentication.",
                    "Decrypts an SSH password.",
                    "Deletes expired SSH certificates.",
                    "Opens a remote shell connection to a server."
                ],
                "correctIndex": 0,
                "explanation": "ssh-keygen creates an authentication key pair; Ed25519 is the modern elliptic-curve public-key algorithm."
            }
        ]
    }

    # 7. Git & version control
    q7 = {
        "id": "git-version-control",
        "name": "Git & version control",
        "displayName": "Git & Distributed Version Control",
        "category": "Software Engineering & Tools",
        "description": "Branching, merging vs rebasing, resolving conflicts, stash, commit history, pull/fetch, and Git workflows.",
        "estimated_minutes": 20,
        "questions": [
            {
                "id": 1,
                "question": "What is the primary difference between 'git merge' and 'git rebase'?",
                "options": [
                    "Merge preserves complete historical commit graph and creates a merge commit; rebase rewrites project history by replaying commits atop the target branch.",
                    "Rebase deletes all commit messages.",
                    "Merge can only be used on the main branch; rebase works on feature branches.",
                    "Rebase requires network access to GitHub; merge operates offline."
                ],
                "correctIndex": 0,
                "explanation": "git merge combines branches with a dedicated merge commit preserving chronology; git rebase moves the feature branch base to maintain a linear history."
            },
            {
                "id": 2,
                "question": "What is the difference between 'git fetch' and 'git pull'?",
                "options": [
                    "git fetch downloads remote commits without merging them into your working copy; git pull fetches and immediately attempts to merge (or rebase).",
                    "git pull only downloads tags.",
                    "git fetch deletes local untracked files.",
                    "There is no difference."
                ],
                "correctIndex": 0,
                "explanation": "git pull is essentially 'git fetch' followed immediately by 'git merge FETCH_HEAD'."
            },
            {
                "id": 3,
                "question": "What does 'git stash' do?",
                "options": [
                    "Temporarily shelves (stashes) uncommitted working directory changes so you can switch branches with a clean working tree.",
                    "Permanently deletes uncommitted files.",
                    "Pushes commits to the remote origin.",
                    "Creates an encrypted tag."
                ],
                "correctIndex": 0,
                "explanation": "git stash saves your dirty work-in-progress on a temporary stack and rolls back the working copy to HEAD."
            },
            {
                "id": 4,
                "question": "What does 'git reset --hard HEAD' do?",
                "options": [
                    "Discards all uncommitted changes in tracked files and resets both staging and working directory back to the latest commit.",
                    "Creates a backup commit.",
                    "Pushes changes to remote origin.",
                    "Merges origin/main into the branch."
                ],
                "correctIndex": 0,
                "explanation": "A hard reset discards all tracked working directory and index modifications, reverting files to the state of HEAD."
            },
            {
                "id": 5,
                "question": "What is the function of the '.gitignore' file?",
                "options": [
                    "Specifies intentionally untracked file patterns (e.g. node_modules, .env, build artifacts) that Git should ignore.",
                    "Stores Git user passwords.",
                    "Disables git push commands.",
                    "Configures the local text editor."
                ],
                "correctIndex": 0,
                "explanation": ".gitignore lists patterns matching files and directories that Git will not track or stage."
            },
            {
                "id": 6,
                "question": "What is the difference between 'git revert <commit>' and 'git reset <commit>'?",
                "options": [
                    "git revert creates a brand new commit that inverts the changes of a previous commit; git reset moves the branch pointer backward, altering history.",
                    "git revert deletes the repository.",
                    "git reset can only be executed by repository administrators.",
                    "They are exact synonyms."
                ],
                "correctIndex": 0,
                "explanation": "git revert safely undoes changes in public shared branches without rewriting history; git reset alters the branch tip."
            },
            {
                "id": 7,
                "question": "What does the 'HEAD' pointer in Git represent?",
                "options": [
                    "A symbolic reference pointing to the currently checked-out commit and branch in the repository.",
                    "The head of the company engineering department.",
                    "The first commit ever made in the project.",
                    "The remote GitHub server address."
                ],
                "correctIndex": 0,
                "explanation": "HEAD is a pointer to the current snapshot and branch checked out in your working tree."
            },
            {
                "id": 8,
                "question": "What is a 'Merge Conflict' in Git?",
                "options": [
                    "A condition where two branches modify the same line of code differently, requiring manual resolution before completing the merge.",
                    "A network error between developer laptops.",
                    "A disk space outage on the server.",
                    "An expired SSH key."
                ],
                "correctIndex": 0,
                "explanation": "Conflicts occur when concurrent edits touch the same lines, preventing Git from automatically choosing which version to retain."
            },
            {
                "id": 9,
                "question": "What command allows you to view the commit history in a one-line concise format with an ASCII graph?",
                "options": ["git log --oneline --graph", "git show --tree", "git history -graph", "git commits -compact"],
                "correctIndex": 0,
                "explanation": "git log --oneline --graph draws an ASCII graph of branch and merge histories alongside compact commit hashes."
            },
            {
                "id": 10,
                "question": "What does 'git cherry-pick <commit-hash>' do?",
                "options": [
                    "Applies the changes introduced by a specific existing commit from another branch onto the current working branch as a new commit.",
                    "Deletes a commit from Git history.",
                    "Renames a branch.",
                    "Pushes one specific file to GitHub."
                ],
                "correctIndex": 0,
                "explanation": "Cherry-pick selects an individual commit from any branch and applies its diff directly onto your currently active HEAD."
            },
            {
                "id": 11,
                "question": "Which command stages all modified and newly created files in the current directory?",
                "options": ["git add .", "git stage all", "git commit -a", "git push --all"],
                "correctIndex": 0,
                "explanation": "git add . stages all changes in the current directory and subdirectories into the staging area (index)."
            },
            {
                "id": 12,
                "question": "What is the purpose of 'git reflog'?",
                "options": [
                    "A safety ledger that records every movement of HEAD, allowing recovery of lost commits even after hard resets or rebase mistakes.",
                    "A list of remote repository contributors.",
                    "An error log file written by Git compiler.",
                    "A backup of deleted branches sent to an email."
                ],
                "correctIndex": 0,
                "explanation": "Reflog tracks local branch updates, enabling developers to restore orphaned commits that no branch currently points to."
            },
            {
                "id": 13,
                "question": "What is a 'Detached HEAD' state?",
                "options": [
                    "When HEAD points directly to a specific commit hash rather than to a named branch.",
                    "When the local repository is disconnected from the internet.",
                    "When Git deletes the master branch.",
                    "When a commit has no author email."
                ],
                "correctIndex": 0,
                "explanation": "Detached HEAD occurs when you checkout a specific commit directly; any new commits created will be orphaned unless a branch is created."
            },
            {
                "id": 14,
                "question": "What is the purpose of 'git tag' (e.g. git tag -a v1.0.0)?",
                "options": [
                    "Creating an immutable named reference pointing to a specific commit, typically used to mark release milestones.",
                    "Labeling files by code syntax.",
                    "Assigning tasks to specific developers.",
                    "Marking duplicate commits for deletion."
                ],
                "correctIndex": 0,
                "explanation": "Tags mark specific points in repository history as important releases (v1.0.0, v2.1.0)."
            },
            {
                "id": 15,
                "question": "Which command switches to an existing branch named 'feature-auth' in modern Git?",
                "options": ["git switch feature-auth", "git branch --change feature-auth", "git move feature-auth", "git update-branch feature-auth"],
                "correctIndex": 0,
                "explanation": "git switch branch_name was introduced to clearly separate branch navigation from file restoration (which git checkout previously overloaded)."
            },
            {
                "id": 16,
                "question": "What does the command 'git diff --staged' show?",
                "options": [
                    "The differences between staged changes (in the index) and the latest commit (HEAD).",
                    "The differences between untracked files.",
                    "Differences between local and remote GitHub branches.",
                    "Changes made in other developer branches."
                ],
                "correctIndex": 0,
                "explanation": "git diff --staged (or --cached) inspects what will go into the next commit if you execute 'git commit'."
            },
            {
                "id": 17,
                "question": "What is a Git 'Fork' on hosting platforms like GitHub/GitLab?",
                "options": [
                    "A personal remote copy of another user's repository that allows you to freely experiment and submit pull requests.",
                    "A hardware tool used to reboot servers.",
                    "Splitting a single file into two parts.",
                    "A Git command built into the local command line."
                ],
                "correctIndex": 0,
                "explanation": "A fork is a server-side clone of a repository under your own account, enabling open-source contribution workflows via Pull Requests."
            },
            {
                "id": 18,
                "question": "What does 'git commit --amend' allow you to do?",
                "options": [
                    "Modify the most recent commit by adding new staged files or updating the commit message.",
                    "Undo the last 5 commits simultaneously.",
                    "Force push all branches to production.",
                    "Merge without conflict checks."
                ],
                "correctIndex": 0,
                "explanation": "git commit --amend combines staged changes with the immediately preceding commit, updating its contents and message."
            },
            {
                "id": 19,
                "question": "What is the purpose of 'git clean -fd'?",
                "options": [
                    "Removes untracked files (-f) and untracked directories (-d) from the working tree.",
                    "Deletes Git history permanently.",
                    "Removes all comments from source code.",
                    "Cleans disk fragmentation."
                ],
                "correctIndex": 0,
                "explanation": "git clean deletes files and directories not tracked by Git, leaving only committed and ignored files."
            },
            {
                "id": 20,
                "question": "What is the standard format of a semantic Git commit message according to Conventional Commits?",
                "options": [
                    "<type>(<scope>): <short description> (e.g., feat(auth): add JWT login endpoint)",
                    "COMMIT #1: changes made today",
                    "Update files on Sunday",
                    "WIP"
                ],
                "correctIndex": 0,
                "explanation": "Conventional Commits enforce structured prefixes (feat, fix, chore, docs, refactor) to enable automated changelogs and semver releases."
            }
        ]
    }

    from skills_8_to_14 import get_skills_8_to_14
    from skills_15_to_20 import get_skills_15_to_20

    skills_8_14 = get_skills_8_to_14()
    skills_15_20 = get_skills_15_to_20()

    # Append quizzes 5, 6, 7 and skills 8-20 to the base
    return base_quizzes + [q5, q6, q7] + skills_8_14 + skills_15_20
