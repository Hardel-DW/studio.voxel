"use client"

import { createDisclosureContext } from "@/components/ui/DisclosureContext"
import { useClickOutside } from "@/lib/hook/useClickOutside"
import { usePopoverVisibility } from "@/lib/hook/usePopoverVisibility"
import { cn } from "@/lib/utils"
import * as React from "react"
import type { ReactElement, ReactNode } from "react"
import { createContext, useContext, useRef, useState } from "react"
import { createPortal } from "react-dom"

interface ContextMenuState {
    position: { x: number; y: number }
    setPosition: (position: { x: number; y: number }) => void
}

const { Provider: ContextMenuProvider, useDisclosure: useContextMenu } = createDisclosureContext<HTMLElement>()
const PositionContext = createContext<ContextMenuState | null>(null)

export function ContextMenu(props: {
    children: ReactNode;
    className?: string;
}) {
    const [position, setPosition] = useState({ x: 0, y: 0 })

    return (
        <ContextMenuProvider>
            <PositionContext.Provider value={{ position, setPosition }}>
                <div className={cn("inline-block", props.className)}>
                    {props.children}
                </div>
            </PositionContext.Provider>
        </ContextMenuProvider>
    )
}

export function ContextMenuTrigger(props: {
    children: ReactElement<{
        onContextMenu?: (e: React.MouseEvent) => void
        ref?: React.Ref<HTMLElement>
        className?: string
    }>
    className?: string
}) {
    const { setOpen, triggerRef } = useContextMenu()
    const positionContext = useContext(PositionContext)

    if (!positionContext) {
        throw new Error("ContextMenuTrigger must be used within ContextMenu")
    }

    const { setPosition } = positionContext

    const handleContextMenu = (e: React.MouseEvent) => {
        e.preventDefault()
        e.stopPropagation()

        // Capture la position du curseur
        setPosition({ x: e.clientX, y: e.clientY })
        setOpen(true)

        // Appel du handler original s'il existe
        props.children.props.onContextMenu?.(e)
    }

    return (
        <>
            {React.cloneElement(props.children, {
                ref: triggerRef,
                onContextMenu: handleContextMenu,
                className: cn(props.children.props.className, props.className)
            })}
        </>
    )
}

export function ContextMenuContent(props: {
    children: ReactNode;
    className?: string;
}) {
    const { open, setOpen } = useContextMenu()
    const positionContext = useContext(PositionContext)
    const contentRef = useRef<HTMLDivElement>(null)
    const { isVisible } = usePopoverVisibility({ open, transitionDuration: 150 })
    const clickOutsideRef = useClickOutside(() => setOpen(false))

    if (!positionContext) {
        throw new Error("ContextMenuContent must be used within ContextMenu")
    }

    const { position } = positionContext

    if (!isVisible && !open) return null

    // Ajuster la position pour éviter de sortir de l'écran
    const adjustedPosition = {
        x: Math.min(position.x, window.innerWidth - 200), // 200px largeur estimée du menu
        y: Math.min(position.y, window.innerHeight - 300) // 300px hauteur estimée du menu
    }

    return createPortal(
        <div
            ref={(node) => {
                contentRef.current = node
                if (clickOutsideRef) {
                    clickOutsideRef.current = node
                }
            }}
            style={{
                position: "fixed",
                top: `${adjustedPosition.y}px`,
                left: `${adjustedPosition.x}px`,
                zIndex: 50
            }}
            hidden={!open}
            className={cn(
                "min-w-[8rem] max-w-[16rem] overflow-hidden rounded-2xl border border-zinc-700 bg-zinc-950 p-1 text-zinc-400 shadow-lg outline-hidden",
                "starting:translate-y-2 starting:scale-95 duration-150 ease-bounce transition-[translate,scale,display,opacity]",
                "hidden:translate-y-2 hidden:scale-95 transition-discrete",
                props.className
            )}>
            {props.children}
        </div>,
        document.body
    )
}

export function ContextMenuItem(props: {
    children: ReactNode
    className?: string
    disabled?: boolean
    onClick?: () => void
}) {
    const { setOpen } = useContextMenu()

    const handleClick = () => {
        if (props.disabled) return
        props.onClick?.()
        setOpen(false)
    }

    return (
        <button
            type="button"
            onClick={handleClick}
            disabled={props.disabled}
            className={cn(
                "relative flex w-full cursor-pointer select-none items-center gap-2 rounded-xl px-2 py-2.5 text-sm text-left outline-hidden transition-colors",
                "hover:bg-zinc-900 hover:text-zinc-200 focus:bg-zinc-900 focus:text-zinc-200",
                "disabled:pointer-events-none disabled:opacity-50",
                "[&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
                props.className
            )}>
            {props.children}
        </button>
    )
}

export function ContextMenuLabel(props: {
    children: ReactNode;
    className?: string;
}) {
    return (
        <div className={cn("px-2 py-1.5 text-sm font-semibold text-zinc-300", props.className)}>
            {props.children}
        </div>
    )
}

export function ContextMenuSeparator(props: { className?: string }) {
    return <div className={cn("-mx-1 my-1 h-px bg-zinc-800", props.className)} />
}

export function ContextMenuGroup(props: {
    children: ReactNode;
    className?: string;
}) {
    return <div className={props.className}>{props.children}</div>
}

export function ContextMenuShortcut(props: {
    children: ReactNode;
    className?: string;
}) {
    return (
        <span className={cn("ml-auto text-xs tracking-widest opacity-60", props.className)}>
            {props.children}
        </span>
    )
}
