// mock/api.ts
import { MockMethod } from "vite-plugin-mock";

// http://localhost:8000/api/users
export default [
  {
    url: "/api/users",
    method: "get",
    response: () => {
      return {
        code: 0,
        data: [
          { id: 1, name: "John", email: "john@example.com" },
          { id: 2, name: "Jane", email: "jane@example.com" },
        ],
      };
    },
  },
  {
    url: "/api/users/:id",
    method: "get",
    response: ({ query }) => {
      return {
        code: 0,
        data: { id: query.id, name: "User " + query.id },
      };
    },
  },
] as MockMethod[];
