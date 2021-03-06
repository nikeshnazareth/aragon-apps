import { safeDiv } from './math-utils'
import {
  VOTE_ABSENT,
  VOTE_YEA,
  VOTE_NAY,
  VOTE_STATUS_ONGOING,
  VOTE_STATUS_REJECTED,
  VOTE_STATUS_ACCEPTED,
  VOTE_STATUS_EXECUTED,
} from './vote-types'

export const EMPTY_CALLSCRIPT = '0x00000001'

export const getAccountVote = (account, voters) =>
  voters[account] || VOTE_ABSENT

export const getVoteStatus = vote => {
  const { open, support, quorum } = vote
  const { yea, nay, executed } = vote.data

  if (executed) {
    return VOTE_STATUS_EXECUTED
  }

  const totalVotes = yea + nay
  const hasSupport = yea / totalVotes >= support
  const hasMinQuorum = getQuorumProgress(vote.data) >= quorum

  if (open) {
    return VOTE_STATUS_ONGOING
  }

  return hasSupport && hasMinQuorum
    ? VOTE_STATUS_ACCEPTED
    : VOTE_STATUS_REJECTED
}

// Enums are not supported by the ABI yet:
// https://solidity.readthedocs.io/en/latest/frequently-asked-questions.html#if-i-return-an-enum-i-only-get-integer-values-in-web3-js-how-to-get-the-named-values
export function voteTypeFromContractEnum(value) {
  if (value === '1') {
    return VOTE_YEA
  }
  if (value === '2') {
    return VOTE_NAY
  }
  return VOTE_ABSENT
}

export const getQuorumProgress = ({ yea, totalVoters }) =>
  safeDiv(yea, totalVoters)
