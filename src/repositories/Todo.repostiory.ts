// import { Todo } from "@prisma/client";
// import { BaseRepository } from "./baserepostiory";

// export class TodoRepository extends BaseRepository<Todo>{}

import { Todo } from '@prisma/client';
import { BaseRepository } from './baserepostiory';

// Todo repository implementation
export class TodoRepository extends BaseRepository<Todo> {
  constructor() {
    super((prisma) => prisma.todo);
  }
}
