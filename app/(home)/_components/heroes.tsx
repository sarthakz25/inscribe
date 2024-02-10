import Image from "next/image";

export const Heroes = () => {
    return (
        <div className="flex flex-col items-center justify-center max-w-5xl">
            <div className="flex items-center gap-x-10 pb-8">
                <div className="relative w-[250px] h-[250px] sm:w-[300px] sm:h-[300px]">
                    <Image
                        src="/hero.svg"
                        fill
                        alt="Documents"
                        className="object-contain dark:hidden"
                    />
                    <Image
                        src="/hero-dark.svg"
                        fill
                        alt="Documents"
                        className="object-contain hidden dark:block"
                    />
                </div>
                <div className="relative w-[350px] h-[350px] hidden md:block">
                    <Image
                        src="/productive.svg"
                        fill
                        alt="Documents"
                        className="object-contain dark:hidden"
                    />
                    <Image
                        src="/productive-dark.svg"
                        fill
                        alt="Documents"
                        className="object-contain hidden dark:block"
                    />
                </div>
            </div>
        </div>
    );
}