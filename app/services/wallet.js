/**
 * @format
 */

import * as Cache from './cache'
import * as Utils from './utils'

/**
 * https://api.lightning.community/#transaction
 * @typedef {object} Transaction
 * @prop {string} tx_hash The transaction hash
 * @prop {number} amount The transaction amount, denominated in satoshis
 * @prop {number} num_confirmations The number of confirmations
 * @prop {string} block_hash The hash of the block this transaction was included
 * in
 * @prop {number} block_height The height of the block this transaction was
 * included in
 * @prop {number} time_stamp Timestamp of this transaction
 * @prop {number} total_fees Fees paid for this transaction
 * @prop {string[]} dest_addresses Addresses that received funds for this
 * transaction
 * @prop {string} raw_tx_hex The raw transaction hex.
 */

/**
 * NOT based on any lightning API. Not supported by API as of commit
 * ed93a9e5c3915e1ccf6f76f0244466e999dbc939 .
 * @typedef {object} NonPaginatedTransactionsRequest
 * @prop {false} paginate
 */

/**
 * NOT based on any lightning API.
 * @typedef {object} PaginatedTransactionsRequest
 * @prop {number} page
 * @prop {true} paginate
 * @prop {number} itemsPerPage
 */

/**
 * https://api.lightning.community/#grpc-response-transactiondetails . Not
 * supported by API as of commit ed93a9e5c3915e1ccf6f76f0244466e999dbc939 .
 * @typedef {object} NonPaginatedTransactionsResponse
 * @prop {Transaction[]} transactions
 */

/**
 * @typedef {object} PaginatedTransactionsResponse
 * @prop {Transaction[]} content
 * @prop {number} page
 * @prop {number} totalPages
 * @prop {number} totalItems
 */

/**
 * https://api.lightning.community/#payment
 * @typedef {object} Payment
 * @prop {string} payment_hash  The payment hash
 * @prop {number} value  Deprecated, use value_sat or value_msat.
 * @prop {number} creation_date  The date of this payment
 * @prop {string[]} path The path this payment took
 * @prop {number} fee Deprecated, use fee_sat or fee_msat.
 * @prop {string} payment_preimage  The payment preimage
 * @prop {number} value_sat  The value of the payment in satoshis
 * @prop {number} value_msat  The value of the payment in milli-satoshis
 * @prop {string} payment_request  The optional payment request being fulfilled.
 * @prop {0|1|2|3} status  The status of the payment. UNKNOWN 0 IN_FLIGHT 1
 * SUCCEEDED 2 FAILED 3
 * @prop {number} fee_sat  The fee paid for this payment in satoshis
 * @prop {number} fee_msat  The fee paid for this payment in milli-satoshis
 */
/**
 * https://api.lightning.community/#hophint
 * @typedef {object} HopHint
 * @prop {string} node_id The public key of the node at the start of the
 * channel.
 * @prop {number} chan_id The unique identifier of the channel.
 * @prop {number} fee_base_msat The base fee of the channel denominated in
 * millisatoshis.
 * @prop {number} fee_proportional_millionths The fee rate of the channel for
 * sending one satoshi across it denominated in millionths of a satoshi.
 * @prop {number} cltv_expiry_delta The time-lock delta of the channel.
 */

/**
 * https://api.lightning.community/#routehint
 * @typedef {object} RouteHint
 * @prop {HopHint[]} hop_hints A list of hop hints that when chained together
 * can assist in reaching a specific destination.
 */

/**
 * https://api.lightning.community/#invoice
 * @typedef {object} Invoice
 * @prop {string} memo  An optional memo to attach along with the invoice. Used
 * for record keeping purposes for the invoice's creator, and will also be set
 * in the description field of the encoded payment request if the
 * description_hash field is not being used.
 * @prop {string} receipt  Deprecated. An optional cryptographic receipt of
 * payment which is not implemented.
 * @prop {string} r_preimage The hex-encoded preimage (32 byte) which will allow
 * settling an incoming HTLC payable to this preimage
 * @prop {string} r_hash The hash of the preimage
 * @prop {number} value  The value of this invoice in satoshis
 * @prop {boolean} settled Whether this invoice has been fulfilled
 * @prop {number} creation_date  When this invoice was created
 * @prop {number} settle_date  When this invoice was settled
 * @prop {string} payment_request A bare-bones invoice for a payment within the
 * Lightning Network. With the details of the invoice, the sender has all the
 * data necessary to send a payment to the recipient.
 * @prop {string} description_hash Hash (SHA-256) of a description of the
 * payment. Used if the description of payment (memo) is too long to naturally
 * fit within the description field of an encoded payment request.
 * @prop {number} expiry Payment request expiry time in seconds. Default is 3600
 * (1 hour).
 * @prop {string} fallback_addr Fallback on-chain address.
 * @prop {number} cltv_expiry Delta to use for the time-lock of the CLTV
 * extended to the final hop.
 * @prop {RouteHint[]} route_hints RouteHint  Route hints that can each be
 * individually used to assist in reaching the invoice's destination.
 * @prop {boolean} private Whether this invoice should include routing hints for
 * private channels.
 * @prop {number} add_index The "add" index of this invoice. Each newly created
 * invoice will increment this index making it monotonically increasing. Callers
 * to the SubscribeInvoices call can use this to instantly get notified of all
 * added invoices with an add_index greater than this one.
 * @prop {number} settle_index  The "settle" index of this invoice. Each newly
 * settled invoice will increment this index making it monotonically increasing.
 * Callers to the SubscribeInvoices call can use this to instantly get notified
 * of all settled invoices with an settle_index greater than this one.
 * @prop {number} amt_paid Deprecated, use amt_paid_sat or amt_paid_msat.
 * @prop {number} amt_paid_sat The amount that was accepted for this invoice, in
 * satoshis. This will ONLY be set if this invoice has been settled. We provide
 * this field as if the invoice was created with a zero value, then we need to
 * record what amount was ultimately accepted. Additionally, it's possible that
 * the sender paid MORE that was specified in the original invoice. So we'll
 * record that here as well.
 * @prop {number} amt_paid_msat  The amount that was accepted for this invoice,
 * in millisatoshis. This will ONLY be set if this invoice has been settled. We
 * provide this field as if the invoice was created with a zero value, then we
 * need to record what amount was ultimately accepted. Additionally, it's
 * possible that the sender paid MORE that was specified in the original
 * invoice. So we'll record that here as well.
 * @prop {0|1|2|3} state The state the invoice is in. OPEN 0 SETTLED 1 CANCELED
 * 2 ACCEPTED 3
 */

/**
 * https://api.lightning.community/#grpc-response-walletbalanceresponse
 * @typedef {object} WalletBalanceResponse
 * @prop {number} total_balance The balance of the wallet
 * @prop {number} confirmed_balance The confirmed balance of a wallet(with >= 1
 * confirmations)
 * @prop {number} unconfirmed_balance The unconfirmed balance of a wallet(with 0
 * confirmations)
 */

/**
 * Not supported in API as of commit ed93a9e5c3915e1ccf6f76f0244466e999dbc939 .
 * https://api.lightning.community/#grpc-request-listpaymentsrequest
 * @typedef {object} ListPaymentsRequest
 * @prop {boolean=} include_incomplete If true, then return payments that have
 * not yet fully completed. This means that pending payments, as well as failed
 * payments will show up if this field is set to True.
 */

/**
 * NOT based on any lightning API.
 * @typedef {object} PaginatedListPaymentsRequest
 * @prop {number} page
 * @prop {true} paginate
 * @prop {number} itemsPerPage
 */

/**
 * @typedef {object} PaginatedListPaymentsResponse
 * @prop {Payment[]} content
 * @prop {number} page
 * @prop {number} totalPages
 * @prop {number} totalItems
 */

/**
 * Not supported in API as of commit ed93a9e5c3915e1ccf6f76f0244466e999dbc939 .
 * https://api.lightning.community/#grpc-request-listinvoicerequest
 * @typedef {object} ListInvoiceRequest
 * @prop {boolean=} pending_only If set, only unsettled invoices will be returned
 * in the response.
 * @prop {number=} index_offset The index of an invoice that will be used as
 * either the start or end of a query to determine which invoices should be
 * returned in the response.
 * @prop {number=} num_max_invoices The max number of invoices to return in the
 * response to this query.
 * @prop {boolean=} reversed If set, the invoices returned will result from
 * seeking backwards from the specified index offset. This can be used to
 * paginate backwards.
 */

/**
 * Not supported in API as of commit ed93a9e5c3915e1ccf6f76f0244466e999dbc939 .
 * @typedef {object} ListInvoiceResponse
 * @prop {Invoice[]} invoices A list of invoices from the time slice of the time
 * series specified in the request.
 * @prop {number} last_index_offset The index of the last item in the set of
 * returned invoices.This can be used to seek further, pagination style.
 * @prop {number} first_index_offset The index of the last item in the set of
 * returned invoices. This can be used to seek backwards, pagination style.
 */

/**
 * NOT based on any lightning API.
 * @typedef {object} PaginatedListInvoicesRequest
 * @prop {number} itemsPerPage
 * @prop {number} page
 */

/**
 * NOT based on any lightning API.
 * @typedef {object} PaginatedListInvoicesResponse
 * @prop {Invoice[]} content
 * @prop {number} page
 * @prop {number} totalPages
 */

/**
 * https://api.lightning.community/#grpc-request-newaddressrequest
 * @typedef {object} NewAddressRequest
 * @prop {0|1|2|3} type The address type. WITNESS_PUBKEY_HASH 0
 * NESTED_PUBKEY_HASH 1 UNUSED_WITNESS_PUBKEY_HASH 2 UNUSED_NESTED_PUBKEY_HASH 3
 */

/**
 * https://api.lightning.community/#grpc-response-newaddressresponse
 * @typedef {object} NewAddressResponse
 * @prop {string} address The newly generated wallet address.
 */
export const NO_CACHED_TOKEN = 'NO_CACHED_TOKEN'

/**
 * @param {Invoice|Payment|Transaction} item
 * @returns {item is Invoice}
 */
export const isInvoice = item => {
  const i = /** @type {Invoice} */ (item)

  return typeof i.r_hash === 'string'
}

/**
 * @param {Invoice|Payment|Transaction} item
 * @returns {item is Payment}
 */
export const isPayment = item => {
  const p = /** @type {Payment} */ (item)

  return typeof p.payment_hash === 'string'
}

/**
 * @param {Invoice|Payment|Transaction} item
 * @returns {item is Transaction}
 */
export const isTransaction = item => {
  const t = /** @type {Transaction} */ (item)

  return typeof t.tx_hash === 'string'
}

/**
 * @returns {Promise<number>}
 */
export const USDExchangeRate = () => {
  // return Promise.resolve(8140.9567)
  const endpoint = 'https://api.coindesk.com/v1/bpi/currentprice.json'

  const payload = {
    method: 'GET',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
  }

  return fetch(endpoint, payload)
    .then(res => {
      if (res.status == 200) {
        return res.json()
      } else {
        throw new Error('Status not 200')
      }
    })
    .then(res => {
      const er = res.bpi.USD.rate_float

      if (typeof er !== 'number') {
        throw new TypeError('Exchange rate obtained from server not a number')
      }

      return er
    })
}

/**
 * @returns {Promise<WalletBalanceResponse>}
 */
export const balance = async () => {
  {
    // return {
    //   confirmed_balance: 200,
    //   total_balance: 100,
    //   unconfirmed_balance: 100,
    // }
  }
  const { nodeIP, token } = await Cache.getNodeIPTokenPair()

  if (typeof token !== 'string') {
    throw new TypeError(NO_CACHED_TOKEN)
  }

  const endpoint = `http://${nodeIP}:9835/api/lnd/walletbalance`

  const payload = {
    method: 'GET',
    headers: {
      Accept: 'application/json',
      Authorization: token,
    },
  }

  const res = await fetch(endpoint, payload)
  const body = await res.json()

  if (res.ok) {
    return body
  } else {
    throw new Error(body.errorMessage || body.message)
  }
}

/**
 * Returns a list describing all the known regular bitcoin network transactions
 * relevant to the wallet.
 * https://api.lightning.community/#gettransactions
 * @param {PaginatedTransactionsRequest} request
 * @throws {Error|TypeError} NO_CACHED_TOKEN - If no token is found. A generic
 * error otherwise, if returned by the API.
 * @returns {Promise<PaginatedTransactionsResponse>}
 */
export const getTransactions = async request => {
  {
    // return {
    //   content: [],
    //   page: 1,
    //   totalItems: 1,
    //   totalPages: 1,
    // }
  }

  const { nodeIP, token } = await Cache.getNodeIPTokenPair()

  if (typeof token !== 'string') {
    throw new TypeError(NO_CACHED_TOKEN)
  }

  const endpoint = `http://${nodeIP}:9835/api/lnd/transactions?paginate=true&page=${
    request.page
  }&itemsPerPage=${request.itemsPerPage}`

  const payload = {
    method: 'GET',
    headers: {
      Accept: 'application/json',
      Authorization: token,
    },
  }

  const res = await fetch(endpoint, payload)
  const body = await res.json()

  if (res.ok) {
    return body
  } else {
    throw new Error(body.errorMessage || body.message)
  }
}

/**
 * Alias for getTransactions().
 */
export const getRegularBitcoinTransactions = getTransactions

/**
 * AKA paid outgoing invoices.
 *
 * https://api.lightning.community/#listpayments
 * @param {PaginatedListPaymentsRequest} request
 * @returns {Promise<PaginatedListPaymentsResponse>}
 */
export const listPayments = async request => {
  {
    // return new Promise(res => {
    //   setTimeout(() => {
    //     res({
    //       content: [
    //         {
    //           creation_date: Date.now(),
    //           fee: 0,
    //           fee_msat: 0,
    //           fee_sat: 0,
    //           path: [],
    //           payment_hash: 'payment_hash',
    //           payment_preimage: 'payment_preimage',
    //           payment_request:
    //             '--lnbc2500u1pvjluezpp5qqqsyqcyq5rqwzqfqqqsyqcyq5rqwzqfqqqsyqcyq5rqwzqfqypqdq5xysxxatsyp3k7enxv4jsxqzpuaztrnwngzn3kdzw5hydlzf03qdgm2hdq27cqv3agm2awhz5se903vruatfhq77w3ls4evs3ch9zw97j25emudupq63nyw24cg27h2rspfj9srp',
    //           status: 3,
    //           value: 0,
    //           value_msat: 0,
    //           value_sat: 0,
    //         },
    //       ],
    //       page: 1,
    //       totalItems: 1,
    //       totalPages: 1,
    //     })
    //   }, 500)
    // })
  }

  const { nodeIP, token } = await Cache.getNodeIPTokenPair()

  if (typeof token !== 'string') {
    throw new TypeError(NO_CACHED_TOKEN)
  }

  const url = `http://${nodeIP}:9835/api/lnd/listpayments?paginate=true&page=${
    request.page
  }&itemsPerPage=${request.itemsPerPage}`

  const payload = {
    method: 'GET',
    headers: {
      Accept: 'application/json',
      Authorization: token,
    },
  }

  const res = await fetch(url, payload)
  const body = await res.json()

  if (res.ok) {
    return body
  } else {
    throw new Error(body.errorMessage || body.message)
  }
}

/**
 * Returns a list of all the invoices currently stored within the database. Any
 * active debug invoices are ignored. It has full support for paginated
 * responses, allowing users to query for specific invoices through their
 * add_index. This can be done by using either the first_index_offset or
 * last_index_offset fields included in the response as the index_offset of the
 * next request. By default, the first 100 invoices created will be returned.
 * Backwards pagination is also supported through the Reversed flag.
 * https://api.lightning.community/?javascript#listinvoices
 * @param {PaginatedListInvoicesRequest} request
 * @returns {Promise<PaginatedListInvoicesResponse>}
 */
export const listInvoices = async request => {
  {
    // return new Promise(res => {
    //   setTimeout(() => {
    //     res({
    //       entries: [
    //         {
    //           add_index: 1,
    //           amt_paid: 0,
    //           amt_paid_msat: 0,
    //           amt_paid_sat: 0,
    //           cltv_expiry: 1,
    //           creation_date: 1496314658,
    //           description_hash: 'description_hash',
    //           expiry: 3600,
    //           fallback_addr: 'fallback_addr',
    //           memo: 'memo',
    //           payment_request:
    //             'lnbc1pvjluezpp5qqqsyqcyq5rqwzqfqqqsyqcyq5rqwzqfqqqsyqcyq5rqwzqfqypqdpl2pkx2ctnv5sxxmmwwd5kgetjypeh2ursdae8g6twvus8g6rfwvs8qun0dfjkxaq8rkx3yf5tcsyz3d73gafnh3cax9rn449d9p5uxz9ezhhypd0elx87sjle52x86fux2ypatgddc6k63n7erqz25le42c4u4ecky03ylcqca784w',
    //           private: false,
    //           r_hash: 'r_hash',
    //           r_preimage: 'r_preimage',
    //           receipt: 'receipt',
    //           route_hints: [],
    //           settle_date: 0,
    //           settle_index: 0,
    //           settled: false,
    //           state: 0,
    //           value: 0,
    //         },
    //       ],
    //       page: 1,
    //       totalPages: 1,
    //     })
    //   }, 1000)
    // })
  }
  const { nodeIP, token } = await Cache.getNodeIPTokenPair()

  if (typeof token !== 'string') {
    throw new TypeError(NO_CACHED_TOKEN)
  }

  const endpoint = `http://${nodeIP}:9835/api/lnd/listinvoices`

  const url = Utils.getQueryParams(endpoint, request)

  const payload = {
    method: 'GET',
    headers: {
      Accept: 'application/json',
      Authorization: token,
    },
  }

  const res = await fetch(url, payload)
  const body = await res.json()

  if (res.ok) {
    return body
  } else {
    throw new Error(body.errorMessage || body.message)
  }
}

/**
 * Alias for listInvoices().
 */
export const listGeneratedInvoices = listInvoices

/**
 * Generates a new regular bitcoin address. Defaults to p2wkh.
 * @param {boolean=} useOlderFormat Will request a nested pubkey hash (np2wkh).
 * @throws {Error}
 * @returns {Promise<string>}
 */
export const newAddress = async useOlderFormat => {
  return new Promise(res => {
    setTimeout(() => {
      res(
        useOlderFormat
          ? '347N1Thc213QqfYCz3PZkjoJpNv5b14kBd'
          : '1BvBMSEYstWetqTFn5Au4m4GFg7xJaNVN2',
      )
    }, 1500)
  })

  /** @type {NewAddressRequest} */
  const req = {
    type: useOlderFormat ? 1 : 0,
  }

  const { nodeIP, token } = await Cache.getNodeIPTokenPair()

  if (typeof token !== 'string') {
    throw new TypeError(NO_CACHED_TOKEN)
  }

  const endpoint = `http://${nodeIP}:9835/api/lnd/newaddress`

  const payload = {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      Authorization: token,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(req),
  }

  const res = await fetch(endpoint, payload)

  const body = await res.json()

  if (res.ok) {
    return /** @type {NewAddressResponse} */ (body).address
  } else {
    throw new Error(body.errorMessage || body.message)
  }
}

/**
 * https://api.lightning.community/?javascript#grpc-request-invoice
 * @typedef {object} AddInvoiceRequest
 * @prop {number} expiry Payment request expiry time in seconds.
 * @prop {string} memo An optional memo to attach along with the invoice. Used
 * for record keeping purposes for the invoice's creator, and will also be set
 * in the description field of the encoded payment request if the
 * description_hash field is not being used.
 */

/**
 * https://api.lightning.community/?javascript#grpc-response-addinvoiceresponse
 * @typedef {object} AddInvoiceResponse
 * @prop {string} r_hash
 * @prop {string} payment_request A bare-bones invoice for a payment within the
 * Lightning Network. With the details of the invoice, the sender has all the
 * data necessary to send a payment to the recipient.
 * @prop {number} add_index The "add" index of this invoice. Each newly created
 * invoice will increment this index making it monotonically increasing.
 * Callers to the SubscribeInvoices call can use this to instantly get notified
 * of all added invoices with an add_index greater than this one.
 */

/**
 * https://api.lightning.community/?javascript#grpc-response-addinvoiceresponse
 * @param {AddInvoiceRequest} request
 * @returns {Promise<AddInvoiceResponse>}
 */
export const addInvoice = async request => {
  return new Promise(res => {
    setTimeout(() => {
      res({
        add_index: 0,
        payment_request:
          'lntb1u1pwz5w78pp5e8w8cr5c30xzws92v36sk45znhjn098rtc4pea6ertnmvu25ng3sdpywd6hyetyvf5hgueqv3jk6meqd9h8vmmfvdjsxqrrssy29mzkzjfq27u67evzu893heqex737dhcapvcuantkztg6pnk77nrm72y7z0rs47wzc09vcnugk2ve6sr2ewvcrtqnh3yttv847qqvqpvv398',
        r_hash: 'r_hash',
      })
    }, 1500)
  })

  const { nodeIP, token } = await Cache.getNodeIPTokenPair()

  if (typeof token !== 'string') {
    throw new TypeError(NO_CACHED_TOKEN)
  }

  const endpoint = `http://${nodeIP}:9835/api/lnd/addinvoice`

  const payload = {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      Authorization: token,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(request),
  }

  const res = await fetch(endpoint, payload)

  const body = await res.json()

  if (res.ok) {
    return body
  } else {
    throw new Error(body.errorMessage || body.message)
  }
}

/**
 * https://api.lightning.community/#grpc-request-sendcoinsrequest
 * @typedef {object} PartialSendCoinsRequest
 * @prop {string} addr The address to send coins to.
 * @prop {number} amount The amount in satoshis to send.
 */

/**
 * https://api.lightning.community/#grpc-response-sendcoinsresponse
 * @typedef {object} SendCoinsResponse
 * @prop {string} txid The transaction ID of the transaction.
 */

/**
 * Resolves to the ID of the newly-created transaction.
 * @param {PartialSendCoinsRequest} request
 * @throws {Error}
 * @returns {Promise<string>}
 */
export const sendCoins = async request => {
  return new Promise((_, rej) => {
    setTimeout(() => {
      rej(new Error('Error Message Goes Here'))
    }, 1000)
  })
  return new Promise(res => {
    setTimeout(() => {
      res('e5ad636a919f94b5ac27b60f81e2072f7384daefcbc6a0833b3a998e7452dccb')
    }, 1000)
  })
  const { nodeIP, token } = await Cache.getNodeIPTokenPair()
  if (typeof token !== 'string') {
    throw new TypeError(NO_CACHED_TOKEN)
  }

  const endpoint = `http://${nodeIP}:9835/api/lnd/sendcoins`

  const payload = {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      Authorization: token,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(request),
  }

  const res = await fetch(endpoint, payload)

  const body = await res.json()

  if (res.ok) {
    return body
  } else {
    throw new Error(body.errorMessage || body.message)
  }
}

/**
 * https://api.lightning.community/#grpc-request-sendrequest
 * @typedef {object} PartialSendRequest
 * @prop {number=} amt CAUTION: Might override the invoice's amount if provided.
 * Should only be asked for when the invoice has no amount embedded in it.
 * @prop {string} payreq AKA invoice.
 */

/**
 * @typedef {object} Hop
 * @prop {number} chan_id
 * @prop {number} chan_capacity
 * @prop {number} amt_to_forward
 * @prop {number} fee
 * @prop {number} expiry
 * @prop {number} amt_to_forward_msat
 * @prop {number} fee_msat
 * @prop {string} pub_key
 */

/**
 * https://api.lightning.community/#route
 * @typedef {object} Route
 * @prop {number} total_time_lock
 * @prop {number} total_fees
 * @prop {number} total_amt
 * @prop {Hop[]} hops
 * @prop {number} total_fees_msat
 * @prop {number} total_amt_msat
 */

/**
 * https://api.lightning.community/#grpc-request-sendrequest
 * @typedef {object} SendResponse
 * @prop {string} payment_error
 * @prop {bytes} payment_preimage
 * @prop {Route} payment_route
 * @prop {bytes} payment_hash
 */

/**
 * Read Request.amt for warning.
 * @param {PartialSendRequest} request
 * @returns {Promise<SendResponse>}
 */
export const CAUTION_payInvoice = async ({ amt, payreq }) => {
  return new Promise(res => {
    setTimeout(() => {
      res({
        payment_error: '',
        payment_hash: '',
        payment_preimage: '',
        payment_route: {
          hops: [
            {
              expiry: 1,
              amt_to_forward: 1,
              amt_to_forward_msat: 1,
              chan_capacity: 1,
              chan_id: 1,
              fee: 0.0001,
              fee_msat: 1,
              pub_key: 'pub_key',
            },
          ],
          total_amt: amt || 1,
          total_amt_msat: (amt || 1) * 1000,
          total_fees: 1,
          total_fees_msat: 1000,
          total_time_lock: 1,
        },
      })
    }, 1000)
  })

  const { nodeIP, token } = await Cache.getNodeIPTokenPair()

  if (typeof token !== 'string') {
    throw new TypeError(NO_CACHED_TOKEN)
  }

  const endpoint = `http://${nodeIP}:9835/api/lnd/sendpayment`

  const payload = {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      Authorization: token,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ amt, payreq }),
  }

  const res = await fetch(endpoint, payload)

  const body = await res.json()

  if (res.ok) {
    return body
  } else {
    throw new Error(body.errorMessage || body.message)
  }
}

/**
 * https://api.lightning.community/#grpc-response-payreq
 * @typedef {object} DecodeInvoiceResponse
 * @prop {string} destination
 * @prop {string} payment_hash
 * @prop {number} num_satoshis
 * @prop {number} timestamp
 * @prop {number} expiry
 * @prop {string} description
 * @prop {string} description_hash
 * @prop {string} fallback_addr
 * @prop {number} cltv_expiry
 * @prop {RouteHint[]} route_hints
 */

/**
 * https://api.lightning.community/#grpc-request-payreqstring
 * @typedef {object} DecodeInvoiceRequest
 * @prop {string} pay_req AKA Invoice
 */

/**
 * @param {DecodeInvoiceRequest} request
 * @returns {Promise<DecodeInvoiceResponse>}
 */
export const decodeInvoice = async ({ pay_req }) => {
  return new Promise(res => {
    setTimeout(() => {
      res({
        cltv_expiry: 1,
        description: 'description',
        description_hash: 'description_hash',
        destination: 'destination',
        expiry: 60,
        fallback_addr: 'fallback_addr',
        num_satoshis: 250000,
        payment_hash: 'payment_hash',
        route_hints: [
          {
            hop_hints: [
              {
                chan_id: 1,
                cltv_expiry_delta: 1,
                fee_base_msat: 100,
                fee_proportional_millionths: 100000000,
                node_id: 'node_id',
              },
            ],
          },
        ],
        timestamp: 1496314658,
      })
    }, 1000)
  })

  const { nodeIP, token } = await Cache.getNodeIPTokenPair()

  if (typeof token !== 'string') {
    throw new TypeError(NO_CACHED_TOKEN)
  }

  const endpoint = `http://${nodeIP}:9835/api/lnd/decodeinvoice`

  const payload = {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      Authorization: token,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ pay_req }),
  }

  const res = await fetch(endpoint, payload)

  const body = await res.json()

  if (res.ok) {
    return body
  } else {
    throw new Error(body.errorMessage || body.message)
  }
}
