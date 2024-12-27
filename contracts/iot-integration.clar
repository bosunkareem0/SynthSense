;; IoT Integration Contract

(define-map iot-devices
  { device-id: uint }
  {
    owner: principal,
    name: (string-ascii 64),
    device-type: (string-ascii 20),
    last-reading: (optional {
      timestamp: uint,
      data: (string-utf8 256)
    })
  }
)

(define-map device-authorizations
  { device-id: uint, user: principal }
  { authorized: bool }
)

(define-data-var last-device-id uint u0)

(define-public (register-device (name (string-ascii 64)) (device-type (string-ascii 20)))
  (let
    (
      (device-id (+ (var-get last-device-id) u1))
    )
    (map-set iot-devices
      { device-id: device-id }
      {
        owner: tx-sender,
        name: name,
        device-type: device-type,
        last-reading: none
      }
    )
    (var-set last-device-id device-id)
    (ok device-id)
  )
)

(define-public (authorize-user (device-id uint) (user principal))
  (let
    (
      (device (unwrap! (map-get? iot-devices { device-id: device-id }) (err u404)))
    )
    (asserts! (is-eq (get owner device) tx-sender) (err u403))
    (ok (map-set device-authorizations
      { device-id: device-id, user: user }
      { authorized: true }
    ))
  )
)

(define-public (revoke-authorization (device-id uint) (user principal))
  (let
    (
      (device (unwrap! (map-get? iot-devices { device-id: device-id }) (err u404)))
    )
    (asserts! (is-eq (get owner device) tx-sender) (err u403))
    (ok (map-set device-authorizations
      { device-id: device-id, user: user }
      { authorized: false }
    ))
  )
)

(define-public (submit-reading (device-id uint) (timestamp uint) (data (string-utf8 256)))
  (let
    (
      (device (unwrap! (map-get? iot-devices { device-id: device-id }) (err u404)))
      (auth (default-to { authorized: false } (map-get? device-authorizations { device-id: device-id, user: tx-sender })))
    )
    (asserts! (or (is-eq (get owner device) tx-sender) (get authorized auth)) (err u403))
    (ok (map-set iot-devices
      { device-id: device-id }
      (merge device { last-reading: (some { timestamp: timestamp, data: data }) })
    ))
  )
)

(define-read-only (get-device (device-id uint))
  (ok (map-get? iot-devices { device-id: device-id }))
)

(define-read-only (get-last-reading (device-id uint))
  (match (map-get? iot-devices { device-id: device-id })
    device (ok (get last-reading device))
    (err u404)
  )
)

