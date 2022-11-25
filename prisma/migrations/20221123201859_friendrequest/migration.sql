-- CreateTable
CREATE TABLE "FriendRequest" (
    "id" SERIAL NOT NULL,
    "creator" INTEGER NOT NULL,
    "receiver" INTEGER NOT NULL,

    CONSTRAINT "FriendRequest_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "FriendRequest" ADD CONSTRAINT "FriendRequest_creator_fkey" FOREIGN KEY ("creator") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FriendRequest" ADD CONSTRAINT "FriendRequest_receiver_fkey" FOREIGN KEY ("receiver") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
