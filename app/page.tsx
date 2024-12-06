import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
// import { hasPermission } from "@/auth/rbac"
import { SignedOut, SignInButton, UserButton } from "@clerk/nextjs"
import { auth } from "@clerk/nextjs/server"
import { Todo, User } from "@/data/types"
import { hasPermission } from "@/auth/abac"
import { CheckIcon, XIcon } from "lucide-react"

// const authorID = '1'

const todos: Todo[] = [
  {
    id: "1",
    title: "Record Video",
    userId: "1",
    completed: false,
    invitedUsers: []
  },
  {
    id: "2",
    title: "Learn Auth",
    userId: "1",
    completed: true,
    invitedUsers: []
  },
  {
    id: "3",
    title: "Build Project",
    userId: "2",
    completed: false,
    invitedUsers: []
  },
  {
    id: "4",
    title: "Master Auth",
    userId: "2",
    completed: true,
    invitedUsers: ["1", "3"]
  }
]

const user: User = { roles: ["user"], id: "3", blockedBy: ["1"] }

export default async function Home() {
  const { sessionClaims, userId } = await auth()

  if (userId === null || sessionClaims === null) {
    return (
      <SignedOut>
        <Button asChild className="mb-3">
          <SignInButton />
        </Button>
      </SignedOut>
    )
  }

  // const user = { id: userId, roles: sessionClaims.roles }

  return (
    <div className="container mx-auto px-4 my-6">
      <h1 className="text-2xl font-semibold mb-4">
        {user.id}: {user.roles.join(", ")}
      </h1>
      <div className="flex gap-4 mb-4">
        <GeneralButtonCheck resource="todos" action="view" />
        <GeneralButtonCheck resource="todos" action="create" />
        <GeneralButtonCheck resource="todos" action="update" />
        <GeneralButtonCheck resource="todos" action="delete" />
      </div>
      <ul className="grid gap-4 grid-cols-2">
        {todos.map(todo => (
          <li key={todo.id}>
            <TodoComponent {...todo} />
          </li>
        ))}
      </ul>
    </div >
  )
}

function TodoComponent(todo: Todo) {
  const { title, userId, completed, invitedUsers } = todo

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex gap-2 items-center">
          {completed ? (
            <CheckIcon className="text-green-500" />
          ) : (
            <XIcon className="text-destructive" />
          )}
        </CardTitle>
        <CardDescription>
          User {userId}{" "}
          {invitedUsers.length > 0 && ` > User ${invitedUsers.join(", User ")}`}
        </CardDescription>
      </CardHeader>
      <CardContent>Capybara is the best</CardContent>
      {/* {(hasPermission(user, "delete:comments") ||
        (hasPermission(user, "delete:ownComments") && user.id === authorID)) && (
        )} */}
      <CardFooter className="gap-2">
        <TodoButttonCheck action="view" todo={todo} />
        <TodoButttonCheck action="update" todo={todo} />
        <TodoButttonCheck action="delete" todo={todo} />
      </CardFooter>
    </Card>
  )
}

function GeneralButtonCheck({ resource, action }: {
  resource: "todos" | "comments"
  action: "view" | "create" | "update" | "delete"
}) {
  return (
    <Button
      variant={
        hasPermission(user, resource, action) ? "default" : "destructive"
      }
    >
      {action} any
    </Button>
  )
}

function TodoButttonCheck({ todo, action }: {
  todo: Todo
  action: "view" | "create" | "update" | "delete"
}) {
  return (
    <Button
      variant={
        hasPermission(user, "todos", action, todo) ? "default" : "destructive"
      }
    >
      {action.toUpperCase()}
    </Button>
  )
}
