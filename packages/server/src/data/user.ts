import { Schema } from "effect";
import { decodeUnknown } from "effect/Schema";

const userSchema = Schema.Struct({
  id: Schema.String,
  username: Schema.String,
  tier: Schema.Struct({
    limit: Schema.Number,
  }),
});

type User = Schema.Schema.Type<typeof userSchema>;
const parseUser = decodeUnknown(userSchema);

export default User;
export { parseUser };
