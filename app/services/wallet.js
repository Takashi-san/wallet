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
 * TODO: These should be numbers.
 * https://api.lightning.community/#grpc-response-walletbalanceresponse
 * @typedef {object} WalletBalanceResponse
 * @prop {string} total_balance The balance of the wallet
 * @prop {string} confirmed_balance The confirmed balance of a wallet(with >= 1
 * confirmations)
 * @prop {string} unconfirmed_balance The unconfirmed balance of a wallet(with 0
 * confirmations)
 */

/**
 * https://api.lightning.community/#grpc-request-listpaymentsrequest
 * @typedef {object} ListPaymentsRequest
 * @prop {boolean=} include_incomplete If true, then return payments that have
 * not yet fully completed. This means that pending payments, as well as failed
 * payments will show up if this field is set to True.
 */

/**
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
 * @typedef {object} ListInvoiceResponse
 * @prop {Invoice[]} invoices A list of invoices from the time slice of the time
 * series specified in the request.
 * @prop {number} last_index_offset The index of the last item in the set of
 * returned invoices.This can be used to seek further, pagination style.
 * @prop {number} first_index_offset The index of the last item in the set of
 * returned invoices. This can be used to seek backwards, pagination style.
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
    throw new Error(body.errorMessage)
  }
}

/**
 * Returns a list describing all the known regular bitconi network transactions
 * relevant to the wallet.
 *
 * https://api.lightning.community/#gettransactions
 * @throws {Error|TypeError} NO_CACHED_TOKEN - If no token is found. A generic
 * error otherwise, if returned by the API.
 * @returns {Promise<Transaction[]>}
 */
export const getTransactions = async () => {
  const { nodeIP, token } = await Cache.getNodeIPTokenPair()

  if (typeof token !== 'string') {
    throw new TypeError(NO_CACHED_TOKEN)
  }

  const endpoint = `http://${nodeIP}:9835/api/lnd/transactions`

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
    return body.transactions
  } else {
    throw new Error(body.errorMessage)
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
 * @param {ListPaymentsRequest=} request
 * @returns {Promise<Payment[]>}
 */
export const listPayments = async (request = {}) => {
  const { nodeIP, token } = await Cache.getNodeIPTokenPair()

  if (typeof token !== 'string') {
    throw new TypeError(NO_CACHED_TOKEN)
  }

  const endpoint = `http://${nodeIP}:9835/api/lnd/listpayments`

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
    return body.payments
  } else {
    throw new Error(body.errorMessage)
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
 * @param {ListInvoiceRequest=} request
 * @returns {Promise<ListInvoiceResponse>}
 */
export const listInvoices = async (request = {}) => {
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
    throw new Error(body.errorMessage)
  }
}

/**
 * Alias for listInvoices().
 */
export const listGeneratedInvoices = listInvoices
