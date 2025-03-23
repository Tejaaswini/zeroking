// Added JWT proof-based identity verification for university-only gameplay
import { Bool, Field, Provable, provable } from 'o1js';
import { GameState } from '../GameState/GameState.js';
import { Move } from '../Move/Move.js';
import { Piece } from '../Piece/Piece.js';
import { RANKS, isRankSuitableForPromotion } from '../Piece/Rank.js';
import { Position } from '../Position/Position.js';
import { PlayerState } from '../PlayerState/PlayerState.js';
import { verifyNoirJwtProof } from '../../noir-jwt/verifyNoirJwtProof.js'; 

// New type to encapsulate a move along with the player's ZK proof
export type AuthenticatedMove = {
  move: Move;
  playerProof: PlayerZkProof;
};

export type PlayerZkProof = {
  publicKey: Field; // identity key for the player
  jwtProof: Field[]; // noir-generated JWT ZK proof
};

export class GameEvent {
  // ... (existing members and constructor remain unchanged)
  // Keep your current logic intact
  // Possibly bind publicKey here in future for signature matching
}

export class GameObject {
  state: GameState;
  constructor(gameState: GameState) {
    this.state = gameState;
  }

  // Modified: accepts authenticated move instead of plain move
  public preMoveValidations(authMove: AuthenticatedMove) {
    const { move, playerProof } = authMove;

    // Verify player has a valid university email domain using noir-jwt
    verifyNoirJwtProof(playerProof.jwtProof, {
      requiredDomain: 'uni.edu',
    });

    const gameEvent = new GameEvent(this.state, move);
    const movesPawn = gameEvent.movesPawn();
    const movesKnight = gameEvent.movesKnight();
    const movesBishop = gameEvent.movesBishop();
    const movesRook = gameEvent.movesRook();
    const movesQueen = gameEvent.movesQueen();
    const movesKing = gameEvent.movesKing();

    return [
      movesPawn,
      movesKnight,
      movesBishop,
      movesRook,
      movesQueen,
      movesKing,
    ]
      .map((m) => Object.values(m).reduce(Bool.or))
      .reduce(Bool.or);
  }

  // Modified: now uses AuthenticatedMove
  public toUpdated(authMove: AuthenticatedMove) {
    const { move, playerProof } = authMove;

    // Again, enforce university-only proof before updating state
    verifyNoirJwtProof(playerProof.jwtProof, {
      requiredDomain: 'uni.edu',
    });

    const gameEvent = new GameEvent(this.state, move);
    // ... rest of original toUpdated logic here remains unchanged

    // Use original GameEvent logic to produce updated state
    // (copy over from your original code block above)

    // For brevity, we’ll omit that here assuming it’s identical
  }

  public illegalCastling(authMove: AuthenticatedMove) {
    const { move } = authMove;
    this.preMoveValidations(authMove);

    const whiteToPlay = this.state.turn;
    const opponentsCastlingRow = Provable.if(whiteToPlay, Field(0), Field(7));

    this.state.kingCastled.assertTrue('the king did not castle last move');

    const kingCastledSide = this.state
      .opponent()
      .getKing()
      .position.column.equals(Field(5));

    const kingSideWasVulnerable = [
      Position.from(opponentsCastlingRow, 4),
      Position.from(opponentsCastlingRow, 5),
    ]
      .map((p) => p.equals(move.path.end()))
      .reduce(Bool.or);

    const queenSideCastledSide = this.state
      .opponent()
      .getKing()
      .position.column.equals(Field(2));

    const queenSideWasVulnerable = [
      Position.from(opponentsCastlingRow, 4),
      Position.from(opponentsCastlingRow, 3),
      Position.from(opponentsCastlingRow, 2),
    ]
      .map((p) => p.equals(move.path.end()))
      .reduce(Bool.or);

    return [
      kingCastledSide.and(kingSideWasVulnerable),
      queenSideCastledSide.and(queenSideWasVulnerable),
    ].reduce(Bool.or);
  }
}

// Assume verifyNoirJwtProof() is a wrapper that validates noir proof
// against a compiled verifier and enforces domain-based claim matching
