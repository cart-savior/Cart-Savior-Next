import { NextApiRequest, NextApiResponse } from "next"
import { NextResponse } from "next/server"

export const config = {
  api: {
    externalResolver: true,
    bodyParser: false,
  },
}

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  return res.status(200).json({test: true})
}

export default handler
