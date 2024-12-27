;; Collaborative Development Contract

(define-map projects
  { project-id: uint }
  {
    name: (string-ascii 64),
    description: (string-utf8 256),
    creator: principal,
    collaborators: (list 10 principal),
    status: (string-ascii 20)
  }
)

(define-map project-tasks
  { project-id: uint, task-id: uint }
  {
    description: (string-utf8 256),
    assignee: principal,
    status: (string-ascii 20)
  }
)

(define-data-var last-project-id uint u0)
(define-data-var last-task-id uint u0)

(define-public (create-project (name (string-ascii 64)) (description (string-utf8 256)))
  (let
    (
      (project-id (+ (var-get last-project-id) u1))
    )
    (map-set projects
      { project-id: project-id }
      {
        name: name,
        description: description,
        creator: tx-sender,
        collaborators: (list tx-sender),
        status: "active"
      }
    )
    (var-set last-project-id project-id)
    (ok project-id)
  )
)

(define-public (add-collaborator (project-id uint) (collaborator principal))
  (let
    (
      (project (unwrap! (map-get? projects { project-id: project-id }) (err u404)))
    )
    (asserts! (is-eq (get creator project) tx-sender) (err u403))
    (ok (map-set projects
      { project-id: project-id }
      (merge project { collaborators: (unwrap! (as-max-len? (append (get collaborators project) collaborator) u10) (err u401)) })
    ))
  )
)

(define-public (create-task (project-id uint) (description (string-utf8 256)) (assignee principal))
  (let
    (
      (task-id (+ (var-get last-task-id) u1))
      (project (unwrap! (map-get? projects { project-id: project-id }) (err u404)))
    )
    (asserts! (is-some (index-of (get collaborators project) tx-sender)) (err u403))
    (map-set project-tasks
      { project-id: project-id, task-id: task-id }
      {
        description: description,
        assignee: assignee,
        status: "open"
      }
    )
    (var-set last-task-id task-id)
    (ok task-id)
  )
)

(define-public (update-task-status (project-id uint) (task-id uint) (new-status (string-ascii 20)))
  (let
    (
      (task (unwrap! (map-get? project-tasks { project-id: project-id, task-id: task-id }) (err u404)))
    )
    (asserts! (is-eq (get assignee task) tx-sender) (err u403))
    (ok (map-set project-tasks
      { project-id: project-id, task-id: task-id }
      (merge task { status: new-status })
    ))
  )
)

(define-read-only (get-project (project-id uint))
  (ok (map-get? projects { project-id: project-id }))
)

(define-read-only (get-task (project-id uint) (task-id uint))
  (ok (map-get? project-tasks { project-id: project-id, task-id: task-id }))
)

