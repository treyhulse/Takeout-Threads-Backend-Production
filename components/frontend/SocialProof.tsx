import Image from "next/image";

interface SocialProofProps {
  title?: string;
  description?: string;
  logoCount?: number;
}

export function SocialProof({
  title = "Trusted by leading print shops",
  description = "Join thousands of print shops that trust Takeout Threads to power their business",
  logoCount = 8,
}: SocialProofProps) {
  return (
    <section className="w-full py-12 md:py-24 lg:py-32 bg-background">
      <div className="max-w-7xl mx-auto px-4 lg:px-8">
        <div className="flex flex-col items-center justify-center space-y-4 text-center">
          <div className="space-y-2">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl text-primary">
              {title}
            </h2>
            <p className="max-w-[900px] text-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
              {description}
            </p>
          </div>
        </div>
        <div className="mx-auto grid max-w-5xl grid-cols-2 gap-6 py-12 lg:grid-cols-4">
          {Array.from({ length: logoCount }).map((_, i) => (
            <div key={i} className="flex items-center justify-center p-4">
              <Image
                src="/placeholder.svg"
                alt={`Customer logo ${i + 1}`}
                width={150}
                height={50}
                className="opacity-70 grayscale hover:opacity-100 hover:grayscale-0 transition-all duration-300"
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
} 