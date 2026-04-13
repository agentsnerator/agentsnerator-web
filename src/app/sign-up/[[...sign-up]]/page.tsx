import { SignUp } from "@clerk/nextjs";

export default function SignUpPage() {
  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center relative overflow-hidden px-4">
      {/* Background glows */}
      <div className="absolute top-[-10%] left-[-5%] w-[400px] h-[400px] bg-primary/15 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-5%] w-[400px] h-[400px] bg-secondary/10 rounded-full blur-[120px] pointer-events-none" />

      {/* Logo */}
      <div className="mb-8 text-center z-10">
        <span className="text-3xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent font-headline tracking-tight">
          AgentsNerator
        </span>
        <p className="text-on-surface-variant font-body text-sm mt-2">
          Start building your agent fleet
        </p>
      </div>

      <div className="z-10 w-full max-w-md">
        <SignUp
          appearance={{
            variables: {
              colorPrimary:         "#db90ff",
              colorBackground:      "#19191c",
              colorText:            "#fffbfe",
              colorTextSecondary:   "#adaaad",
              colorInputBackground: "#131316",
              colorInputText:       "#fffbfe",
              colorDanger:          "#ff6e84",
              borderRadius:         "0.5rem",
              fontFamily:           "Manrope, sans-serif",
            },
            elements: {
              rootBox:               "w-full",
              card:                  "bg-surface-container border border-outline-variant/20 shadow-[0_20px_60px_rgba(0,0,0,0.5)] rounded-xl",
              headerTitle:           "font-headline font-bold text-on-surface text-2xl",
              headerSubtitle:        "text-on-surface-variant font-body text-sm",
              socialButtonsBlockButton: "bg-surface-container-high border border-outline-variant/20 text-on-surface hover:bg-surface-bright transition-colors",
              socialButtonsBlockButtonText: "font-label font-bold text-sm",
              dividerLine:           "bg-outline-variant/20",
              dividerText:           "text-on-surface-variant text-xs font-label uppercase tracking-widest",
              formFieldLabel:        "text-on-surface-variant text-xs font-label uppercase tracking-wider",
              formFieldInput:        "bg-surface-container-low border-none text-on-surface focus:border-b-2 focus:border-secondary rounded-lg",
              formButtonPrimary:     "bg-gradient-to-br from-primary to-primary-dim text-on-primary font-headline font-bold hover:brightness-110 active:scale-95 transition-all",
              footerActionLink:      "text-primary hover:text-primary-dim font-label font-bold",
              alertText:             "text-error font-body text-sm",
              formFieldErrorText:    "text-error font-label text-xs",
            },
          }}
        />
      </div>
    </div>
  );
}
