;; Sense Marketplace Contract

(define-map listings
  { listing-id: uint }
  {
    seller: principal,
    name: (string-ascii 64),
    description: (string-utf8 256),
    price: uint,
    category: (string-ascii 20),
    active: bool
  }
)

(define-data-var last-listing-id uint u0)

(define-public (create-listing (name (string-ascii 64)) (description (string-utf8 256)) (price uint) (category (string-ascii 20)))
  (let
    (
      (listing-id (+ (var-get last-listing-id) u1))
    )
    (map-set listings
      { listing-id: listing-id }
      {
        seller: tx-sender,
        name: name,
        description: description,
        price: price,
        category: category,
        active: true
      }
    )
    (var-set last-listing-id listing-id)
    (ok listing-id)
  )
)

(define-public (update-listing (listing-id uint) (new-price uint) (active bool))
  (let
    (
      (listing (unwrap! (map-get? listings { listing-id: listing-id }) (err u404)))
    )
    (asserts! (is-eq (get seller listing) tx-sender) (err u403))
    (ok (map-set listings
      { listing-id: listing-id }
      (merge listing { price: new-price, active: active })
    ))
  )
)

(define-public (buy-listing (listing-id uint))
  (let
    (
      (listing (unwrap! (map-get? listings { listing-id: listing-id }) (err u404)))
    )
    (asserts! (get active listing) (err u400))
    (try! (stx-transfer? (get price listing) tx-sender (get seller listing)))
    (ok (map-set listings
      { listing-id: listing-id }
      (merge listing { active: false })
    ))
  )
)

(define-read-only (get-listing (listing-id uint))
  (ok (map-get? listings { listing-id: listing-id }))
)

