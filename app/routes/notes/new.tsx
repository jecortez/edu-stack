import type {ActionArgs} from '@remix-run/node';
import {json, redirect} from '@remix-run/node';
import {Form, useActionData} from '@remix-run/react';
import * as React from 'react';
import {graphql, gql} from '~/graphql.server';
import {requireUserId} from '~/session.server';

export async function action({request}: ActionArgs) {
  const userId = await requireUserId(request);

  const formData = await request.formData();
  const title = formData.get('title');
  const body = formData.get('body');

  if (typeof title !== 'string' || title.length === 0) {
    return json(
      {errors: {title: 'Title is required', body: null}},
      {status: 400},
    );
  }

  if (typeof body !== 'string' || body.length === 0) {
    return json(
      {errors: {body: 'Body is required', title: null}},
      {status: 400},
    );
  }

  const data = await graphql.request(
    gql(`
      mutation CreateNote($title: String!, $body: String!, $userId: String!) {
        createNote(title: $title, body: $body, userId: $userId) {
          id
        }
      }
    `),
    {title, body, userId},
  );

  return redirect(`/notes/${data.createNote.id}`);
}

export default function NewNotePage() {
  const actionData = useActionData<typeof action>();
  const titleRef = React.useRef<HTMLInputElement>(null);
  const bodyRef = React.useRef<HTMLTextAreaElement>(null);

  React.useEffect(() => {
    if (actionData?.errors?.title) {
      titleRef.current?.focus();
    } else if (actionData?.errors?.body) {
      bodyRef.current?.focus();
    }
  }, [actionData]);

  return (
    <Form
      method="post"
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: 8,
        width: '100%',
      }}
    >
      <div>
        <label className="flex w-full flex-col gap-1">
          <span>Title: </span>
          <input
            aria-describedby={
              actionData?.errors?.title ? 'title-error' : undefined
            }
            aria-errormessage={
              actionData?.errors?.title ? 'title-error' : undefined
            }
            aria-invalid={actionData?.errors?.title ? true : undefined}
            className="flex-1 rounded-md border-2 border-blue-500 px-3 text-lg leading-loose"
            name="title"
            ref={titleRef}
          />
        </label>
        {actionData?.errors?.title && (
          <div className="pt-1 text-red-700" id="title-error">
            {actionData.errors.title}
          </div>
        )}
      </div>

      <div>
        <label className="flex w-full flex-col gap-1">
          <span>Body: </span>
          <textarea
            aria-describedby={
              actionData?.errors?.body ? 'body-error' : undefined
            }
            aria-errormessage={
              actionData?.errors?.body ? 'body-error' : undefined
            }
            aria-invalid={actionData?.errors?.body ? true : undefined}
            className="w-full flex-1 rounded-md border-2 border-blue-500 py-2 px-3 text-lg leading-6"
            name="body"
            ref={bodyRef}
            rows={8}
          />
        </label>
        {actionData?.errors?.body && (
          <div className="pt-1 text-red-700" id="body-error">
            {actionData.errors.body}
          </div>
        )}
      </div>

      <div className="text-right">
        <button
          className="rounded bg-blue-700  py-2 px-4 text-white hover:bg-blue-800 focus:bg-blue-400"
          type="submit"
        >
          Save
        </button>
      </div>
    </Form>
  );
}
