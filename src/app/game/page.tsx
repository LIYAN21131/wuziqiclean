"use client";

import { GameActionBar } from "@/features/game/components/GameActionBar";
import { GameOverModal } from "@/features/game/components/GameOverModal";
import { GomokuBoard } from "@/features/game/components/GomokuBoard";
import { AiThinkingBadge, PlayerBar } from "@/features/game/components/PlayerBar";
import { TurnTimer } from "@/features/game/components/TurnTimer";
import { UndoToast } from "@/features/game/components/UndoToast";
import { StitchHeader } from "@/shared/components/layout/StitchHeader";
import { useUserProfile } from "@/features/profile/context/SettingsProvider";
import { useGomokuGame } from "@/features/game/hooks/useGomokuGame";
import { GAME_TITLE, PLAYER } from "@/shared/lib/constants";
import { useRouter } from "next/navigation";

export default function GamePage() {
  const router = useRouter();
  const profile = useUserProfile();
  const game = useGomokuGame();

  const humanActive =
    game.status === "playing" &&
    game.currentTurn === PLAYER.human &&
    !game.isAiThinking &&
    !game.isUndoAnimating;

  const aiActive =
    game.status === "playing" &&
    (game.currentTurn === PLAYER.ai || game.isAiThinking);

  const timerActive = game.status === "playing" && game.timerTurnOwner !== null;

  const handleResign = () => {
    if (window.confirm("确定要认输吗？")) {
      game.resign();
    }
  };

  if (!game.ready) {
    return (
      <div className="flex min-h-app items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-3">
          <div className="h-10 w-10 animate-spin rounded-full border-2 border-primary border-t-transparent" />
          <p className="text-sm text-secondary">加载棋盘…</p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative min-h-app bg-background px-safe pb-[calc(7rem+env(safe-area-inset-bottom,0px))]">
      <div className="watermark-ly" aria-hidden>
        LY制作
      </div>

      <UndoToast message={game.undoToast} onDismiss={game.dismissUndoToast} />

      <StitchHeader
        title={GAME_TITLE}
        centerTitle
        onBack={() => router.push("/lobby")}
        showMenu={false}
        showPlayerChip
      />

      <main className="relative z-10 mx-auto flex max-w-lg flex-col items-center gap-3 px-4 pt-[calc(4.5rem+env(safe-area-inset-top,0px))]">
        <div className="flex w-full items-center justify-between gap-1">
          <PlayerBar
            isHuman
            name={profile.displayName}
            signature={profile.signature}
            avatarUrl={profile.avatarUrl}
            showOnlineStatus
            isActive={humanActive}
            turnLabel={humanActive ? "到你了" : undefined}
          />
          <TurnTimer
            seconds={game.turnSecondsLeft}
            totalSeconds={game.totalTurnSeconds}
            active={timerActive}
            urgency={game.timerUrgency}
            label={
              game.timerTurnOwner === "human"
                ? "你的回合"
                : game.timerTurnOwner === "ai"
                  ? "AI"
                  : undefined
            }
          />
          <PlayerBar
            isHuman={false}
            name="Sophia L."
            isActive={aiActive}
            turnLabel={game.isAiThinking ? "思考中" : aiActive ? "落子中" : undefined}
          />
        </div>

        {game.isAiThinking && <AiThinkingBadge />}

        <GomokuBoard
          board={game.board}
          lastMove={game.lastMove}
          winningLine={game.winningLine}
          currentTurn={game.currentTurn}
          humanColor={game.humanColor}
          validMoves={game.validMoves}
          retractingPositions={game.retractingPositions}
          disabled={
            game.status !== "playing" ||
            game.isAiThinking ||
            game.isUndoAnimating ||
            game.turnSecondsLeft <= 0
          }
          onIntersectionClick={game.playHumanMove}
        />

        <span className="rounded-full bg-surface-container-low px-4 py-1.5 text-label font-semibold text-primary">
          对局 #{game.matchId}
        </span>
      </main>

      <GameActionBar
        onUndo={game.undoLast}
        onResign={handleResign}
        undoRemaining={game.undoRemaining}
        undoMax={game.maxUndo}
        undoDisabled={!game.canUndo}
        undoDisabledReason={game.undoDisabledReason}
        isUndoAnimating={game.isUndoAnimating}
      />

      <GameOverModal
        open={game.showResultModal}
        won={game.status === "won"}
        draw={game.status === "draw"}
        endReason={game.endReason}
        elapsedSeconds={game.elapsedSeconds}
        moveCount={game.moveCount}
        onPlayAgain={() => game.resetGame()}
        onViewBoard={() => game.setShowResultModal(false)}
        onClose={() => game.setShowResultModal(false)}
      />

      {game.showResultModal && (
        <div
          className="pointer-events-none fixed inset-0 z-[55] bg-black/10 backdrop-blur-[3px]"
          aria-hidden
        />
      )}
    </div>
  );
}
