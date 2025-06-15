// import { Todo } from "@prisma/client";
// import { BaseRepository } from "./baserepostiory";

// export class TodoRepository extends BaseRepository<Todo>{}

import { user } from '@prisma/client';
import { BaseRepository } from './baserepostiory';

// Todo repository implementation
export class UserRepository extends BaseRepository<user> {
  constructor() {
    super((prisma) => prisma.user);
  }
}
