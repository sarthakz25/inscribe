import Image from "next/image";

export const Heroes = () => {
    return (
        <div className="flex flex-col items-center justify-center max-w-5xl">
            <div className="flex items-center gap-x-8">
                <div className="relative w-[250px] h-[250px] sm:w-[300px] sm:h-[300px] md:w-[350px] md:h-[350px]">
                    <Image 
                        src="/documents.png"
                        fill
                        alt="Documents"
                        className="object-contain dark:hidden"
                    />
                    <Image
                        src="/documents-dark.png"
                        fill
                        alt="Documents"
                        className="object-contain hidden dark:block"
                    />
                </div>
                <div className="relative w-[325px] h-[325px] hidden md:block">
                    <Image
                        src="/reading.png"
                        fill
                        alt="Reading"
                        className="object-contain dark:hidden"
                    />
                    <Image
                        src="/reading-dark.png"
                        fill
                        alt="Reading"
                        className="object-contain hidden dark:block"
                    />
                </div>
            </div>
        </div>
    );
}