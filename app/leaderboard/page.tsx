import Header from "@/app/components/header";

export default function Leaderboard() {
    return (
        <div className="flex flex-col flex-1 items-center justify-center bg-background font-sans">
            <Header theme="leaderboard" />
            <main className="flex flex-1 w-full max-w-3xl flex-col items-center justify-between py-32 px-16 bg-background dark:bg-background sm:items-start">
                <h1>Leaderboard</h1>
            </main>
        </div>
    );
}