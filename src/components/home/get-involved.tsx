import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Mail, Info, Megaphone } from "lucide-react";

const ACTIONS = [
  {
    label: "Get in Contact",
    description: "Have a question or feedback? We'd love to hear from you",
    href: "/help",
    icon: Mail,
  },
  {
    label: "About HiringLens",
    description: "Learn more about our mission and how it all started",
    href: "/about",
    icon: Info,
  },
  {
    label: "Advertise With Us",
    description: "Reach thousands of job seekers and hiring professionals",
    href: "/help",
    icon: Megaphone,
  },
];

export function GetInvolved() {
  return (
    <section className="border-t bg-muted/30">
      <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-20">
        <div className="animate-in-view mb-8 text-center">
          <h2 className="text-4xl font-medium leading-[1.1] sm:text-5xl">
            Want to get <span className="text-foreground/25">involved?</span>
          </h2>
          <p className="mx-auto mt-2 max-w-md text-muted-foreground">
            Whether you want to contribute, collaborate, or advertise, there
            are plenty of ways to be part of HiringLens.
          </p>
        </div>
        <div className="animate-in-view-d1 grid gap-4 sm:grid-cols-3">
          {ACTIONS.map((action) => (
            <Button
              key={action.label}
              variant="outline"
              asChild
              className="h-auto flex-col gap-2 whitespace-normal px-6 py-6 text-center"
            >
              <Link href={action.href}>
                <action.icon className="h-6 w-6 text-primary" />
                <span className="text-base font-semibold">{action.label}</span>
                <span className="text-xs font-normal text-muted-foreground">
                  {action.description}
                </span>
              </Link>
            </Button>
          ))}
        </div>
      </div>
    </section>
  );
}
