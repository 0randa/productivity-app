```javascript
let data = {
    username: "Generic_Username",
    today_xp: 0,
    next_task_id: 1,
    tracker: [
        {
            task_id: 0
            date: "1/1/2000",
            task: "Homework"
            start_time: "1:00:00",
            end_time: "2:00:00",
            tags: ["Study"]
        }
    ]
    past_xp: {
        date: "1/1/1999",
        xp: 100
    }
}
```

<!-- Support for Multiplayer -->
```javascript
let data = {
    users: [
        {
            user_id: 0,
            username: "Generic_Username",
            email: 'generic_email@unsw.edu.au',
            password: 'Password1',
            tracker: [
                {
                    task_id: 0
                    date: "1/1/2000",
                    task: "Homework"
                    start_time: "1:00:00",
                    end_time: "2:00:00",
                    tags: ["Study"]
                }
            ],
            past_xp: {
                date: "1/1/1999",
                xp: 100
            }
        }
    ],
    tokens: [
        {
            session_id: 0,
            user_id: 0
        }
    ],
    next_user_id: 1,
    next_session_id: 1,
    next_task_id: 1
}
```