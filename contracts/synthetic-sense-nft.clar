;; Synthetic Sense NFT Contract

(define-non-fungible-token synthetic-sense-nft uint)

(define-data-var last-token-id uint u0)

(define-map token-metadata
  { token-id: uint }
  {
    name: (string-ascii 64),
    description: (string-utf8 256),
    creator: principal,
    uri: (string-utf8 256)
  }
)

(define-public (mint (name (string-ascii 64)) (description (string-utf8 256)) (uri (string-utf8 256)))
  (let
    (
      (token-id (+ (var-get last-token-id) u1))
    )
    (try! (nft-mint? synthetic-sense-nft token-id tx-sender))
    (map-set token-metadata
      { token-id: token-id }
      {
        name: name,
        description: description,
        creator: tx-sender,
        uri: uri
      }
    )
    (var-set last-token-id token-id)
    (ok token-id)
  )
)

(define-public (transfer (token-id uint) (sender principal) (recipient principal))
  (begin
    (asserts! (is-eq tx-sender sender) (err u403))
    (nft-transfer? synthetic-sense-nft token-id sender recipient)
  )
)

(define-read-only (get-token-metadata (token-id uint))
  (ok (map-get? token-metadata { token-id: token-id }))
)

(define-read-only (get-owner (token-id uint))
  (ok (nft-get-owner? synthetic-sense-nft token-id))
)

