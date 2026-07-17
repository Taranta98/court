"use client";

import {
  addClubPhotoAction,
  deleteClubPhotoAction,
  setCoverPhotoAction,
  updateClubProfileAction,
} from "@/actions/club";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useActionState, useTransition } from "react";

interface ClubPhoto {
  id: string;
  url: string;
}

interface ClubPhotosSectionProps {
  imageUrl: string;
  description: string;
  openingHours: string;
  photos: ClubPhoto[];
}

export function ClubPhotosSection({
  imageUrl,
  description,
  openingHours,
  photos,
}: ClubPhotosSectionProps) {
  const [profileState, profileAction, profilePending] = useActionState(
    updateClubProfileAction,
    null,
  );
  const [photoState, photoAction, photoPending] = useActionState(addClubPhotoAction, null);
  const [isPending, startTransition] = useTransition();

  function handleDeletePhoto(photoId: string) {
    startTransition(async () => {
      await deleteClubPhotoAction(photoId);
    });
  }

  function handleSetCover(photoId: string) {
    startTransition(async () => {
      await setCoverPhotoAction(photoId);
    });
  }

  return (
    <div className="space-y-8">
      <form action={profileAction} className="space-y-4 rounded-xl border border-zinc-200 bg-white p-5">
        <h3 className="font-semibold text-zinc-900">Immagine di copertina e profilo</h3>

        {profileState?.error && (
          <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">{profileState.error}</p>
        )}
        {profileState?.success && (
          <p className="rounded-lg bg-emerald-50 px-3 py-2 text-sm text-emerald-800">
            {profileState.success}
          </p>
        )}

        <div className="relative h-40 w-full overflow-hidden rounded-lg bg-zinc-100">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={imageUrl} alt="Copertina circolo" className="h-full w-full object-cover" />
        </div>

        <Input
          label="URL immagine di copertina"
          name="imageUrl"
          type="url"
          defaultValue={imageUrl}
          placeholder="https://..."
          error={profileState?.fieldErrors?.imageUrl?.[0]}
        />

        <div>
          <label htmlFor="description" className="block text-sm font-medium text-zinc-700">
            Descrizione
          </label>
          <textarea
            id="description"
            name="description"
            rows={4}
            defaultValue={description}
            className="mt-1 w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20"
          />
          {profileState?.fieldErrors?.description?.[0] && (
            <p className="mt-1 text-xs text-red-600">
              {profileState.fieldErrors.description[0]}
            </p>
          )}
        </div>

        <Input
          label="Orari di apertura (testo pubblico)"
          name="openingHours"
          type="text"
          defaultValue={openingHours}
          placeholder="Lun–Dom 8:00 – 22:00"
          error={profileState?.fieldErrors?.openingHours?.[0]}
        />

        <Button type="submit" disabled={profilePending}>
          {profilePending ? "Salvataggio..." : "Salva profilo"}
        </Button>
      </form>

      <form action={photoAction} className="space-y-4 rounded-xl border border-zinc-200 bg-white p-5">
        <h3 className="font-semibold text-zinc-900">Galleria foto</h3>
        <p className="text-sm text-zinc-600">
          Aggiungi foto del circolo inserendo l&apos;URL di un&apos;immagine.
        </p>

        {photoState?.error && (
          <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">{photoState.error}</p>
        )}
        {photoState?.success && (
          <p className="rounded-lg bg-emerald-50 px-3 py-2 text-sm text-emerald-800">
            {photoState.success}
          </p>
        )}

        <Input
          label="URL nuova foto"
          name="url"
          type="url"
          placeholder="https://..."
          error={photoState?.fieldErrors?.url?.[0]}
        />

        <Button type="submit" disabled={photoPending}>
          {photoPending ? "Aggiunta..." : "Aggiungi foto"}
        </Button>

        {photos.length > 0 && (
          <ul className="grid gap-3 sm:grid-cols-2">
            {photos.map((photo) => (
              <li
                key={photo.id}
                className="overflow-hidden rounded-lg border border-zinc-200 bg-zinc-50"
              >
                <div className="relative h-32 w-full">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={photo.url} alt="Foto circolo" className="h-full w-full object-cover" />
                </div>
                <div className="flex gap-2 p-2">
                  <Button
                    type="button"
                    variant="outline"
                    className="flex-1 text-xs"
                    disabled={isPending}
                    onClick={() => handleSetCover(photo.id)}
                  >
                    Copertina
                  </Button>
                  <Button
                    type="button"
                    variant="secondary"
                    className="flex-1 text-xs"
                    disabled={isPending}
                    onClick={() => handleDeletePhoto(photo.id)}
                  >
                    Elimina
                  </Button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </form>
    </div>
  );
}
