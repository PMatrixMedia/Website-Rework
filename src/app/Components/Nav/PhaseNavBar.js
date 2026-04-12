"use client";

import { useLayoutEffect, useRef } from "react";
import Link from "next/link";
import gsap from "gsap";
import { Button, Text } from "@radix-ui/themes";

const NAV_ITEM_SELECTOR = "[data-phase-nav-item]";

function prefersReducedMotion() {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

/**
 * Radix-styled nav link for use inside PhaseNavBar or custom dropdowns.
 */
export function PhaseNavLink({
  href,
  external,
  Icon,
  children,
  "aria-label": ariaLabel,
  iconOnly,
  className,
}) {
  const linkClass = ["phase-nav-link", className].filter(Boolean).join(" ");
  const a11yLabel = iconOnly ? ariaLabel : undefined;
  const inner = (
    <>
      {Icon ? <Icon className="phase-nav-icon" width={30} height={30} aria-hidden /> : null}
      {!iconOnly ? children : null}
    </>
  );

  return (
    <Button variant="ghost" size="4" asChild className="phase-nav-button-root">
      {external ? (
        <a
          href={href}
          className={linkClass}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={a11yLabel}
        >
          {inner}
        </a>
      ) : (
        <Link href={href} className={linkClass} aria-label={a11yLabel}>
          {inner}
        </Link>
      )}
    </Button>
  );
}

/**
 * @param {object} props
 * @param {Array<
 *   | { key: string; href: string; label: import('react').ReactNode; Icon?: import('react').ComponentType<{className?: string; width?: number; height?: number}>; external?: boolean }
 *   | { key: string; custom: import('react').ReactNode }
 * >} [props.items]
 * @param {import('react').ReactNode} [props.leading]
 * @param {import('react').ReactNode} [props.trailing] — wrap each stagger target with `data-phase-nav-item` if multiple.
 * @param {'start' | 'between'} [props.justify]
 * @param {string} [props.className]
 * @param {"1"|"2"|"3"|"4"|"5"|"6"|"7"|"8"|"9"} [props.labelTextSize] Radix Text size for string labels (default 6)
 */
export function PhaseNavBar({
  items = [],
  leading = null,
  trailing = null,
  justify = "start",
  className,
  labelTextSize = "6",
}) {
  const rootRef = useRef(null);

  useLayoutEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    if (prefersReducedMotion()) {
      return;
    }

    const targets = root.querySelectorAll(NAV_ITEM_SELECTOR);
    if (!targets.length) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        targets,
        { opacity: 0, y: 10 },
        {
          opacity: 1,
          y: 0,
          duration: 0.45,
          stagger: 0.08,
          ease: "power3.out",
        },
      );
    }, root);

    return () => ctx.revert();
  }, []);

  const trackClass = [
    "phase-nav-track",
    justify === "between" ? "phase-nav-track-between" : "",
  ]
    .filter(Boolean)
    .join(" ");

  const shellClass = ["phase-nav-shell", className].filter(Boolean).join(" ");

  return (
    <header ref={rootRef} className={shellClass}>
      <div className={trackClass}>
        {leading ? (
          <span data-phase-nav-item className="phase-nav-item-wrap">
            {leading}
          </span>
        ) : null}

        {items.map((entry) => {
          if ("custom" in entry) {
            return (
              <span key={entry.key} data-phase-nav-item className="phase-nav-item-wrap">
                {entry.custom}
              </span>
            );
          }

          const { key, href, label, Icon, external } = entry;
          return (
            <span key={key} data-phase-nav-item className="phase-nav-item-wrap">
              <PhaseNavLink href={href} external={external} Icon={Icon}>
                {typeof label === "string" ? (
                  <Text size={labelTextSize} weight="medium">
                    {label}
                  </Text>
                ) : (
                  label
                )}
              </PhaseNavLink>
            </span>
          );
        })}

        {trailing}
      </div>
    </header>
  );
}
