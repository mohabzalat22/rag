import { NextResponse } from "next/server";

interface Message<T = unknown> {
  success: boolean;
  statusCode: number;
  message: string;
  data: T[];
}

type ErrorMessage<T = unknown> = Omit<Message, "data"> & {
  errors: T[];
};

export function Success<T = unknown>(
  success = true,
  statusCode = 200,
  message: string,
  data: T[] = []
): NextResponse<Message<T>> {
  return NextResponse.json(
    {
      success,
      statusCode,
      message,
      data,
    },
    { status: statusCode }
  );
}

export function Error<T = unknown>(
  success = false,
  statusCode = 400,
  message: string,
  errors: T[] = []
): NextResponse<ErrorMessage<T>> {
  return NextResponse.json(
    {
      success,
      statusCode,
      message,
      errors,
    },
    { status: statusCode }
  );
}
