"use client";

import {
  fetchClubNotificationsAction,
  markAllNotificationsReadAction,
  markNotificationReadAction,
} from "@/actions/notifications";
import type { ClubNotificationDTO } from "@/lib/club/notifications";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { useCallback, useEffect, useRef, useState, useTransition } from "react";

interface ClubNotificationsBellProps {
  initialNotifications: ClubNotificationDTO[];
  initialUnreadCount: number;
}

function formatBookingDate(iso: string) {
  return new Date(iso).toLocaleString("it-IT", {
    weekday: "short",
    day: "numeric",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function formatEuro(amount: number) {
  return new Intl.NumberFormat("it-IT", {
    style: "currency",
    currency: "EUR",
    maximumFractionDigits: 0,
  }).format(amount);
}

export function ClubNotificationsBell({
  initialNotifications,
  initialUnreadCount,
}: ClubNotificationsBellProps) {
  const [open, setOpen] = useState(false);
  const [notifications, setNotifications] = useState(initialNotifications);
  const [unreadCount, setUnreadCount] = useState(initialUnreadCount);
  const [isPending, startTransition] = useTransition();
  const panelRef = useRef<HTMLDivElement>(null);

  const refresh = useCallback(async () => {
    const data = await fetchClubNotificationsAction();
    setNotifications(data.notifications);
    setUnreadCount(data.unreadCount);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      void refresh();
    }, 15_000);

    return () => clearInterval(interval);
  }, [refresh]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (panelRef.current && !panelRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    }

    if (open) {
      document.addEventListener("mousedown", handleClickOutside);
      void refresh();
    }

    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [open, refresh]);

  function handleMarkRead(notificationId: string) {
    startTransition(async () => {
      await markNotificationReadAction(notificationId);
      await refresh();
    });
  }

  function handleMarkAllRead() {
    startTransition(async () => {
      await markAllNotificationsReadAction();
      await refresh();
    });
  }

  return (
    <div ref={panelRef} className="relative">
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        className="relative flex size-10 items-center justify-center rounded-full text-zinc-700 hover:bg-zinc-100"
        aria-label={`Notifiche${unreadCount > 0 ? `, ${unreadCount} non lette` : ""}`}
        aria-expanded={open}
      >
        <svg
          className="size-5"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.75}
          stroke="currentColor"
          aria-hidden
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M14.857 17.082a23.848 23.848 0 0 0 5.454-1.31A8.967 8.967 0 0 1 18 9.75V9A6 6 0 0 0 6 9v.75a8.967 8.967 0 0 1-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 0 1-5.714 0m5.714 0a3 3 0 1 1-5.714 0"
          />
        </svg>
        {unreadCount > 0 && (
          <span className="absolute right-1.5 top-1.5 flex size-4 items-center justify-center rounded-full bg-emerald-600 text-[10px] font-bold text-white">
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 z-50 mt-2 w-[min(100vw-2rem,22rem)] overflow-hidden rounded-xl border border-zinc-200 bg-white shadow-lg">
          <div className="flex items-center justify-between border-b border-zinc-100 px-4 py-3">
            <h3 className="font-semibold text-zinc-900">Notifiche</h3>
            {unreadCount > 0 && (
              <button
                type="button"
                onClick={handleMarkAllRead}
                disabled={isPending}
                className="text-xs font-medium text-emerald-700 hover:text-emerald-800 disabled:opacity-50"
              >
                Segna tutte lette
              </button>
            )}
          </div>

          <ul className="max-h-80 overflow-y-auto">
            {notifications.length === 0 ? (
              <li className="px-4 py-8 text-center text-sm text-zinc-500">
                Nessuna prenotazione ricevuta.
              </li>
            ) : (
              notifications.map((notification) => {
                const isUnread = !notification.readAt;

                return (
                  <li
                    key={notification.id}
                    className={cn(
                      "border-b border-zinc-50 last:border-b-0",
                      isUnread && "bg-emerald-50/50",
                    )}
                  >
                    <button
                      type="button"
                      onClick={() => {
                        if (isUnread) handleMarkRead(notification.id);
                      }}
                      className="w-full px-4 py-3 text-left hover:bg-zinc-50"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <p className="text-sm font-medium text-zinc-900">
                          Nuova prenotazione
                        </p>
                        {isUnread && (
                          <span className="mt-1 size-2 shrink-0 rounded-full bg-emerald-500" />
                        )}
                      </div>
                      <p className="mt-1 text-sm text-zinc-700">
                        {notification.booking.userName} · {notification.booking.courtName}
                      </p>
                      <p className="mt-0.5 text-xs text-zinc-500">
                        {formatBookingDate(notification.booking.startAt)}
                      </p>
                      <p className="mt-1 text-xs font-medium text-emerald-700">
                        {formatEuro(notification.booking.totalAmount)}
                      </p>
                    </button>
                  </li>
                );
              })
            )}
          </ul>

          <div className="border-t border-zinc-100 px-4 py-3">
            <Link
              href="/club/prenotazioni"
              onClick={() => setOpen(false)}
              className="text-sm font-medium text-emerald-700 hover:text-emerald-800"
            >
              Vedi tutte le prenotazioni →
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
