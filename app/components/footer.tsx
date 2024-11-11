export default function Footer() {
    return (
      <div className="fixed bottom-2 mt-10 bottom-8 w-full text-center">
        {/* Footer stats */}
        <div className="relative flex justify-center">
          <div className="px-4 py-1 rounded-full bg-[#1a1b26] text-neutral-400 text-sm mb-2">
            9 books indexed
          </div>
        </div>
        <div className="text-neutral-500 text-sm">
          Made by{" "}
          <a
            href="https://twitter.com/ofcboogeyman" 
            target="_blank" // Opens in a new tab
            rel="noopener noreferrer" // Provides security and performance benefits
            className="text-purple-500"
          >
            @ofcboogeyman
          </a>
        </div>
      </div>
    );
  }