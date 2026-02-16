# Overall Requirement

# **Core Technical Requirements for Event Web Platform**

Purpose:

This platform is required to conduct and manage all rounds of the event smoothly. It will 

function as the central system for participants, judges, and organizers.

1\. Login System

\- Separate login for teams, judges, and admin.

\- Each team gets unique Team ID and password.

\- Secure authentication required.

2\. Team Dashboard

\- Display team name, track, and current round.

\- Show instructions for each round

3\. Card (Subtask) Selection System

\- System must show 2 random subtasks to each team.

\- Teams can select only one subtask.

\- Once selected, choice must be locked.

\- System must store:

• Cards shown to team

• Card selected

• Timestamp

• Team ID

4\. Submission Module (Round 1\)

\- File upload or GitHub link submission.

\- PPT/document upload support.

\- Deadline-based auto locking after submission.

\- Confirmation message after submission.

5\. Judge Panel

\- Judges can log in and view assigned teams.

\- View team submissions.

\- Enter scores and remarks.

\- Save and update scores.

6\. Admin Panel (Core Control)

Admin must be able to:

\- Add/edit/delete teams.

\- Upload and manage subtasks/cards.

\- Start and end each round.

\- View all team selections and submissions.

\- Enter or edit scores.

\- Shortlist teams for next round.

9\. Team Activity & History Tracking

Admin view must show:

\- Subtasks shown each round

\- Subtasks chosen

\- Scores per round

\- Submission status

10\. Timer System

\- Countdown timer for active rounds.

\- Auto lock selection/submission when time ends.

11\. Final Round Control

\- Admin can release final task manually.

\- Display task only when activated.

\- Submission/implementation tracking.

12\. Data & Stability Requirements

\- Must handle 300 teams login simultaneously.

\- Database backup required.

\- Stable hosting required.

\- Mobile \+ laptop responsive.

Conclusion:

This platform is a live event management system, not a static website.

Focus must be on reliability, tracking, and smooth execution of all rounds.

# Frontend Plan

**Frontend Plan**

/login

\-\> Default login as a team ( team leader, google account login)   
\-\> Google login for admin and judges  
\-\> Card for google OAuth

Admin:

    1\. /admin

\-\> A card to show all the teams summary  
\-\> A section for the current round, number of submissions and pending evaluation details  
\-\> A panel/card to control rounds  
	\- a dropdown for selecting rounds  
	\- buttons to change round status (start/stop)  
	\- turning on and off submissions

    2\. /admin/rounds

\-\> Show all the rounds row by row. A button to create new rounds.  
\-\> If a round is clicked it should redirect to /admin/rounds/{:round\_id}

    3\. /admin/round/{:round\_id}

\-\> An option to display all the subtasks for this round and also an option to create new subtasks.  
\-\> Round start and stop  
\-\> Show all the selected teams in a table  
\-\> each team row should show the previously shown options and the option that the team chose and also two new dropdowns to select the next round task for that team

    4\. /admin/teams

\-\> An editable main table displaying alll the team details including score, submission status and current round, current track etc.  
\-\> Individual team actions like locking submissions, shortlisting/elimination should be shown when a team is clicked.

    5\. /admin/judges

\-\> A section to display all the judges.  
\-\> Add judges   
\-\> Option to assign teams to each judge for evaluation of the current rounds

Judge:

    1\. /judge

\-\> Should be able to see all the assigned team names along with status (pending/scored).

\-\> If the judge clicks on a team it should redirect to the next page.

    2\. /judge/{:round}?team\_id=

\-\> Display team info  
\-\> Display selected card info with uploaded files / links if any.  
\-\> A field for score and adding remarks

Team:

    1\. /team/dashboard

\-\> Display team name, track, and current round name.  
\-\> Countdown timer  
\-\> An instructions section with current round instructions  
\-\> Button to go to the rounds page  
\-\> Show the current round status

    2\. /team/rounds

\-\> Display all the rounds for the team.  
\-\> If we click on a round redirect to the next page.

    3\. /team/rounds/{:id}

\-\> Initially two subtasks card will be shown and there will be a select button on each card. Once select is clicked that task is selected by the team.

\-\> After a card is selected new section for submission in displayed. This section will initially be hidden at the start of each round.   
\-\> for Round 1, show teams option to upload pdfs

# Backend Plan

**Backend Plan: API Routes**

1. **Used by /login (Frontend) :** 

POST —-  /api/auth/login   
POST —-  /api/auth/logout

* If team\_id \+ password → find team → validate via users table  
* If username \+ password → admin/judge login

**2./admin (Dashboard)**  
GET  /api/admin/dashboard  
Returns:

* Total teams  
* Current round  
* Submissions count  
* Pending evaluation count  
* Round status

**Round Control**

PATCH /api/admin/rounds/:round\_id/start  
PATCH /api/admin/rounds/:round\_id/stop  
PATCH /api/admin/rounds/:round\_id/toggle-submission  
Updates:

* is\_active  
* submission lock

**/admin/rounds**  
GET    /api/admin/rounds  
POST   /api/admin/rounds  
DELETE /api/admin/rounds/:round\_id

 **/admin/round/:round\_id (Subtasks Management)**  
GET    /api/admin/rounds/:round\_id/subtasks  
POST   /api/admin/rounds/:round\_id/subtasks  
PUT    /api/admin/subtasks/:subtask\_id  
DELETE /api/admin/subtasks/:subtask\_id  
DB Tables Used:

* rounds  
* subtasks

**/admin/teams(Get all teams)**  
GET  /api/admin/teams  
Returns:

* Team info  
* Current round  
* Submission status  
* Scores

**Add Team**  
POST /api/admin/teams  
**Delete Team**  
DELETE /api/admin/teams/:team\_id  
**Lock Submission**  
PATCH /api/admin/teams/:team\_id/lock  
**Shortlist Team**  
POST /api/admin/teams/:team\_id/shortlist

**/admin/judges**  
GET    /api/admin/judges  
POST   /api/admin/judges  
DELETE /api/admin/judges/:judge\_id

**Assign Teams to Judge**  
POST /api/admin/judges/:judge\_id/assign  
Table used:

* judge\_assignments

**3\. Judge Route**   
**/judge**  
GET /api/judge/assigned-teams?round\_id=  
Returns:

* Team name  
* Status (pending/scored)

**/judge/:round?team\_id=**  
GET  /api/judge/rounds/:round\_id/teams/:team\_id  
POST /api/judge/rounds/:round\_id/teams/:team\_id/score  
PUT  /api/judge/rounds/:round\_id/teams/:team\_id/score  
GET returns:

* Team info  
* Selected subtask  
* Submission file/github link

POST/PUT:  
Stores in **scores** table  
**4\. TEAM ROUTES**  
**/team/dashboard**  
GET /api/team/dashboard  
Returns:

* Team name  
* Track  
* Current round  
* Timer  
* Instructions  
* Round status

Tables:

* teams  
* rounds

 **/team/rounds**  
GET /api/team/rounds  
Returns all rounds \+ status  
**/team/rounds/:id**  
(Get 2 Random Subtasks)  
GET /api/team/rounds/:round\_id/subtasks/random  
**Step 1:** 

* Fetch 2 random rows  
* Store them in team\_subtask\_display

**Step 2: Select One**  
POST /api/team/rounds/:round\_id/select

* Insert in team\_subtask\_selection  
* Enforce UNIQUE(team\_id, round\_id)

**Step 3: Submit Work**  
POST /api/team/rounds/:round\_id/submit  
**Body:**  
**{**  
  **file\_url,**  
  **github\_link**  
**}**

* Insert into submissions  
* Check if round active  
* Check if not locked

# Database Schema

**Database Schema** 

# 1\. users Collection

SQL:

`users(id, email, role, team_id)`

MongoDB:

`users: {`  
  `_id: ObjectId,`  
  `email: String,`  
  `password_hash: String,`  
  `role: "team" | "judge" | "admin",`

  `team_id: ObjectId, // NULL for judges/admin`

  `created_at: Date`  
`}`

2\. Teams   
SQL:

`teams(team_id, team_name, track, rounds_accessible)`

MongoDB:

`teams: {`  
  `_id: ObjectId,`

  `team_name: String,`  
  `track: String,`

  `rounds_accessible: [ObjectId],`

  `created_at: Date`  
`}`

# **3\. judges Collection**

SQL:

`judges(id, name, user_id)`

MongoDB:

`judges: {`  
  `_id: ObjectId,`

  `user_id: ObjectId,`

  `name: String,`

  `created_at: Date`  
`}`

# **4\. rounds Collection**

MongoDB:

`rounds: {`  
  `_id: ObjectId,`

  `round_number: Number,`

  `start_time: Date,`  
  `end_time: Date,`

  `is_active: Boolean,`

  `submission_enabled: Boolean,`

  `created_at: Date`  
`}`

# **5\. subtasks Collection**

MongoDB:

`subtasks: {`  
  `_id: ObjectId,`

  `title: String,`  
  `description: String,`

  `round_id: ObjectId,`

  `is_active: Boolean,`

  `created_at: Date`  
`}`

---

#  **6\. team\_subtask\_display Collection**

Tracks which cards were shown.

MongoDB:

`team_subtask_display: {`  
  `_id: ObjectId,`

  `team_id: ObjectId,`  
  `round_id: ObjectId,`

  `subtask_id: ObjectId,`

  `shown_at: Date`  
`}`

# **7\. team\_subtask\_selection Collection**

MongoDB:

`team_subtask_selection: {`  
  `_id: ObjectId,`

  `team_id: ObjectId,`  
  `round_id: ObjectId,`

  `subtask_id: ObjectId,`

  `selected_at: Date`  
`}`

Add unique index:

`db.team_subtask_selection.createIndex(`  
  `{ team_id: 1, round_id: 1 },`  
  `{ unique: true }`  
`)`

Prevents multiple selection.

#  **8\. submissions Collection**

MongoDB:

`submissions: {`  
  `_id: ObjectId,`

  `team_id: ObjectId,`  
  `round_id: ObjectId,`

  `file_url: String,`  
  `github_link: String,`

  `submitted_at: Date,`

  `is_locked: Boolean`  
`}`

---

# **9\. judge\_assignments Collection**

MongoDB:

`judge_assignments: {`  
  `_id: ObjectId,`

  `judge_id: ObjectId,`  
  `team_id: ObjectId,`  
  `round_id: ObjectId,`

  `assigned_at: Date`  
`}`

---

# **10\. scores Collection**

MongoDB:

`scores: {`  
  `_id: ObjectId,`

  `judge_id: ObjectId,`  
  `team_id: ObjectId,`  
  `round_id: ObjectId,`

  `score: Number,`

  `remarks: String,`

  `updated_at: Date`  
`}`

Add unique index:

`db.scores.createIndex(`  
  `{ judge_id: 1, team_id: 1, round_id: 1 },`  
  `{ unique: true }`  
`)`

---

# **11\. shortlisted\_teams Collection**

MongoDB:

`shortlisted_teams: {`  
  `_id: ObjectId,`

  `team_id: ObjectId,`  
  `round_id: ObjectId,`

  `shortlisted_at: Date`  
`}`

---

# **12\. final\_tasks Collection**

MongoDB:

`final_tasks: {`  
  `_id: ObjectId,`

  `title: String,`  
  `description: String,`

  `is_released: Boolean,`

  `released_at: Date`  
`}`

# Work Split

**Work Split**

**Repo setup steps:**

- Run: git clone [https://github.com/Codechef-VITC-Student-Chapter/CC-Hackathon.git](https://github.com/Codechef-VITC-Student-Chapter/CC-Hackathon.git)  
- Run: git checkout staging  
- Do all your work  
- Run: git add .   
- Run: git checkout \-b page\_name/route\_name (eg: git checkout \-b ui-admin, git checkout \-b api-admin)  
- Run: git commit \-m “feat: add your work” (eg: git commit \-m “feat: add admin pages”)  
- Run: git push origin branch\_name (eg: git push origin ui-admin)   
- Notes:   
  - Don’t push to staging or main branch  
  - Create a Pull Request from your branch to **staging** not main

**Frontend ( POC \- Sooraj )**

- Arkajyothi: /login page  
- Achal Tripati: All admin pages (/admin, /admin/rounds, /admin/round/\[round\_id\], /admin/teams, /admin/judges)  
- Nithin Kumar: All judge pages (/judge, /judge/\[round\]?team\_id=)  
- Tanush: All team pages (/team/dashboard, /team/rounds, /team/rounds/\[id\])


  
**Backend ( POC \- Manmay )**

- Manmay (lead): Auth routes  
  - POST /api/auth/login, POST /api/auth/logout  
- Sumit: All admin API routes  
  - GET /api/admin/dashboard  
  - GET/POST/DELETE /api/admin/rounds  
  - PATCH /api/admin/rounds/:round\_id/{start|stop|toggle-submission}  
  - GET/POST /api/admin/rounds/:round\_id/subtasks  
  - PUT/DELETE /api/admin/subtasks/:subtask\_id  
  - GET/POST/DELETE /api/admin/teams  
  - PATCH /api/admin/teams/:team\_id/lock  
  - POST /api/admin/teams/:team\_id/shortlist  
  - GET/POST/DELETE /api/admin/judges  
  - POST /api/admin/judges/:judge\_id/assign  
- Rakshit: All judge API routes  
  - GET /api/judge/assigned-teams  
  - GET /api/judge/rounds/:round\_id/teams/:team\_id  
  - POST/PUT /api/judge/rounds/:round\_id/teams/:team\_id/score  
- Gowreesh: All team API routes  
  - GET /api/team/dashboard  
  - GET /api/team/rounds  
  - GET /api/team/rounds/:round\_id/subtasks/random  
  - POST /api/team/rounds/:round\_id/select  
  - POST /api/team/rounds/:round\_id/submit

 