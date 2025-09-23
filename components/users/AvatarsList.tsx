"use client";
import { useOthers, useSelf } from "@liveblocks/react/suspense";
import React from "react";
import Avatar from "./Avatar";
import { generateRandomName } from "@/lib/utils";

const AvatarsList = () => {
  const users = useOthers();
  const currentUser = useSelf();

  const memoizedUsers = React.useMemo(() => {
    const hasMoreUsers = users.length > 3;
    return (
      <div className="flex pl-3 items-center gap-1">
        {users.slice(0, 3).map(({ connectionId, info }) => {
          return <Avatar key={connectionId} name={generateRandomName()} />;
        })}

        {hasMoreUsers && <div className="avatar-more">+{users.length - 3}</div>}

        {currentUser && (
          <div className="relative first:ml-0!">
            <Avatar name="You" className="border-green" />
          </div>
        )}
      </div>
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [users.length!]);
  return memoizedUsers;
};

export default AvatarsList;
