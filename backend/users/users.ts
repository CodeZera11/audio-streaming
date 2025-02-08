import { api } from "encore.dev/api";

interface Response {
  users: {
    id: number;
    name: string;
  }[];
}

export const getMockUsers = api<{}, Response>(
  {
    method: "GET",
    path: "/mock-users",
    expose: true,
  },
  async () => {
    return {
      users: [
        {
          id: 1,
          name: "Foo",
        },
        {
          id: 2,
          name: "Bar",
        },
        {
          id: 3,
          name: "Baz",
        },
      ],
    };
  }
);
