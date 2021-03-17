import {
  BsvhuMetadata,
  BsvhuMetadataResolvers
} from "../../generated/graphql/types";
import { getFormOrFormNotFound } from "../database";
import { validateVhuForm } from "../validation";

const bsvhuMetadataResolvers: BsvhuMetadataResolvers = {
  errors: async (metadata: BsvhuMetadata & { id: string }) => {
    const prismaForm = await getFormOrFormNotFound(metadata.id);

    try {
      await validateVhuForm(prismaForm, {
        emitterSignature: true,
        transporterSignature: true,
        recipientSignature: true
      });
      return [];
    } catch (errors) {
      return errors.inner?.map(e => {
        return {
          message: e.message,
          path: e.path, // TODO return a path formated correctly
          requiredFor: "TRANSPORTER" // TODO Identify which signature needs this field
        };
      });
    }
  }
};

export default bsvhuMetadataResolvers;