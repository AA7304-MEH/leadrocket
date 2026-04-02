import { ReactNode } from "react";

/**
 * VisuallyHidden - Hides content visually while keeping it accessible to screen readers
 */
interface VisuallyHiddenProps {
    children: ReactNode;
    as?: keyof JSX.IntrinsicElements;
}

export const VisuallyHidden = ({ children, as: Component = "span" }: VisuallyHiddenProps) => {
    return (
        <Component
            style={{
                position: "absolute",
                width: "1px",
                height: "1px",
                padding: "0",
                margin: "-1px",
                overflow: "hidden",
                clip: "rect(0, 0, 0, 0)",
                whiteSpace: "nowrap",
                border: "0",
            }}
        >
            {children}
        </Component>
    );
};

/**
 * SkipLink - Allows keyboard users to skip navigation and jump to main content
 */
interface SkipLinkProps {
    href?: string;
    children?: ReactNode;
}

export const SkipLink = ({ href = "#main-content", children = "Skip to main content" }: SkipLinkProps) => {
    return (
        <a
            href={href}
            className="sr-only focus:not-sr-only focus:absolute focus:z-50 focus:p-4 focus:bg-primary focus:text-white focus:top-0 focus:left-0"
        >
            {children}
        </a>
    );
};

/**
 * FocusTrap - Traps focus within a container (useful for modals)
 */
interface FocusTrapProps {
    children: ReactNode;
    active?: boolean;
}

export const FocusTrap = ({ children, active = true }: FocusTrapProps) => {
    if (!active) return <>{children}</>;

    // Basic implementation - in production, use a library like focus-trap-react
    return <div role="dialog" aria-modal="true">{children}</div>;
};

/**
 * LiveRegion - Announces dynamic content changes to screen readers
 */
interface LiveRegionProps {
    children: ReactNode;
    politeness?: "polite" | "assertive" | "off";
    atomic?: boolean;
}

export const LiveRegion = ({
    children,
    politeness = "polite",
    atomic = true
}: LiveRegionProps) => {
    return (
        <div
            role="status"
            aria-live={politeness}
            aria-atomic={atomic}
            className="sr-only"
        >
            {children}
        </div>
    );
};

/**
 * Accessible icon button helper
 */
interface AccessibleIconProps {
    label: string;
    children: ReactNode;
}

export const AccessibleIcon = ({ label, children }: AccessibleIconProps) => {
    return (
        <>
            {children}
            <VisuallyHidden>{label}</VisuallyHidden>
        </>
    );
};

/**
 * KeyboardNavigation - Adds keyboard navigation to a grid of items
 */
export const useKeyboardNavigation = (
    itemCount: number,
    columns: number,
    onSelect: (index: number) => void
) => {
    const handleKeyDown = (event: React.KeyboardEvent, currentIndex: number) => {
        let newIndex = currentIndex;

        switch (event.key) {
            case "ArrowRight":
                newIndex = Math.min(currentIndex + 1, itemCount - 1);
                break;
            case "ArrowLeft":
                newIndex = Math.max(currentIndex - 1, 0);
                break;
            case "ArrowDown":
                newIndex = Math.min(currentIndex + columns, itemCount - 1);
                break;
            case "ArrowUp":
                newIndex = Math.max(currentIndex - columns, 0);
                break;
            case "Home":
                newIndex = 0;
                break;
            case "End":
                newIndex = itemCount - 1;
                break;
            case "Enter":
            case " ":
                onSelect(currentIndex);
                event.preventDefault();
                return;
            default:
                return;
        }

        if (newIndex !== currentIndex) {
            event.preventDefault();
            // Focus the new element
            const element = document.querySelector(`[data-index="${newIndex}"]`) as HTMLElement;
            element?.focus();
        }
    };

    return { handleKeyDown };
};

/**
 * Accessibility color contrast checker
 */
export const getContrastRatio = (foreground: string, background: string): number => {
    const getLuminance = (color: string): number => {
        const rgb = parseInt(color.slice(1), 16);
        const r = (rgb >> 16) & 0xff;
        const g = (rgb >> 8) & 0xff;
        const b = (rgb >> 0) & 0xff;

        const [rs, gs, bs] = [r / 255, g / 255, b / 255].map((c) => {
            return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
        });

        return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs;
    };

    const l1 = getLuminance(foreground);
    const l2 = getLuminance(background);
    const lighter = Math.max(l1, l2);
    const darker = Math.min(l1, l2);

    return (lighter + 0.05) / (darker + 0.05);
};

export const isWCAGCompliant = (foreground: string, background: string, level: "AA" | "AAA" = "AA"): boolean => {
    const ratio = getContrastRatio(foreground, background);
    return level === "AA" ? ratio >= 4.5 : ratio >= 7;
};
