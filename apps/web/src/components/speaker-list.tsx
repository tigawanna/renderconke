import { EmptyState } from "@/components/empty-state";
import { LoadingState } from "@/components/loading-state";
import { ScrollArea } from "@/components/m3e/scroll-area";
import { SearchField, useSearchQuery } from "@/components/search-field";
import {
  Item,
  ItemContent,
  ItemDescription,
  ItemGroup,
  ItemMedia,
  ItemTitle,
} from "@/components/m3e/item";
import { SearchResult } from "@/components/m3e/search";
import { speakersQueryOptions, type Speaker } from "@/data-access-layer/speakers";
import { useQueryClient } from "@tanstack/react-query";
import { Link, useNavigate } from "@tanstack/react-router";

export function SpeakerList() {
  const client = useQueryClient();
  const navigate = useNavigate();
  const { value, setValue, data, isLoading, isError, isPlaceholderData } = useSearchQuery(
    ["speakers", "list"],
    async (query) => {
      const speakers = await client.query(speakersQueryOptions);
      return speakers.filter((speaker) => matchesSpeaker(speaker, query));
    },
  );

  return (
    <div className="flex h-full min-h-0 flex-col gap-4">
      <div className="shrink-0">
        <SearchField placeholder="Search speakers" size="sm" value={value} onValueChange={setValue}>
          {(data ?? []).map((speaker) => (
            <SearchResult
              key={speaker.id}
              icon="person"
              onClick={() =>
                void navigate({ to: "/speakers/$speakerId", params: { speakerId: speaker.id } })
              }
            >
              {speaker.fullName}
            </SearchResult>
          ))}
        </SearchField>
      </div>
      {isLoading && !data ? (
        <div className="flex min-h-0 flex-1">
          <LoadingState label="Loading speakers…" />
        </div>
      ) : null}
      {isError || (!data && !isLoading) ? (
        <div className="flex min-h-0 flex-1">
          <EmptyState
            tone="error"
            icon="error"
            title="Speakers unavailable"
            description="Speakers could not be loaded."
          />
        </div>
      ) : null}
      {data && data.length === 0 ? (
        <div className="flex min-h-0 flex-1">
          <EmptyState
            description={
              value
                ? "No speaker matches that search."
                : "Speakers will show up here once they are announced."
            }
            icon="groups"
            title="No speakers"
          />
        </div>
      ) : null}
      {data && data.length > 0 ? (
        <ScrollArea className="min-h-0 flex-1">
          <ItemGroup className={isPlaceholderData ? "opacity-70" : undefined}>
            {data.map((speaker) => (
              <Item
                key={speaker.id}
                variant="muted"
                className="bg-surface-container-low shadow-elevation-1 hover:shadow-elevation-2"
                render={<Link to="/speakers/$speakerId" params={{ speakerId: speaker.id }} />}
              >
                <ItemMedia variant="image">
                  <img alt="" src={speaker.profilePicture} />
                </ItemMedia>
                <ItemContent>
                  <ItemTitle>{speaker.fullName}</ItemTitle>
                  <ItemDescription>{speaker.tagLine}</ItemDescription>
                </ItemContent>
              </Item>
            ))}
          </ItemGroup>
        </ScrollArea>
      ) : null}
    </div>
  );
}

function matchesSpeaker(speaker: Speaker, query: string) {
  const needle = query.trim().toLowerCase();
  if (!needle) return true;
  return [speaker.fullName, speaker.tagLine, speaker.bio, ...speaker.sessions.map((s) => s.name)]
    .join(" ")
    .toLowerCase()
    .includes(needle);
}
