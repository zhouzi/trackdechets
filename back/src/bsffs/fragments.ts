import { gql } from "apollo-server-express";

// Fragments used for documentation and for tests

const fullFicheIntervention = gql`
  fragment FullFicheIntervention on BsffFicheIntervention {
    id
    numero
    weight
    detenteur {
      company {
        siret
        name
        address
        country
        contact
        phone
        mail
      }
    }
    operateur {
      company {
        siret
        name
        address
        country
        contact
        phone
        mail
      }
    }
    postalCode
  }
`;

export const fullBsff = gql`
  fragment FullBsff on Bsff {
    id
    isDraft
    createdAt
    updatedAt
    status
    type
    emitter {
      customInfo
      company {
        siret
        name
        address
        country
        contact
        phone
        mail
      }
      emission {
        signature {
          author
          date
        }
      }
    }
    packagings {
      name
      volume
      numero
      weight
    }
    waste {
      code
      nature
      adr
    }
    weight {
      value
      isEstimate
    }
    transporter {
      customInfo
      company {
        siret
        name
        address
        country
        contact
        phone
        mail
      }
      recepisse {
        number
        department
        validityLimit
      }
      transport {
        mode
        signature {
          author
          date
        }
      }
    }
    destination {
      customInfo
      company {
        siret
        name
        address
        country
        contact
        phone
        mail
      }
      cap
      plannedOperationCode
      reception {
        date
        weight
        acceptationStatus
        refusalReason
        signature {
          date
          author
        }
      }
      operation {
        code
        nextDestination {
          company {
            siret
            name
            address
            country
            contact
            phone
            mail
          }
        }
        signature {
          author
          date
        }
      }
    }
    ficheInterventions {
      ...FullFicheIntervention
    }
    forwarding {
      id
    }
    forwardedIn {
      id
    }
    repackaging {
      id
    }
    repackagedIn {
      id
    }
    grouping {
      bsff {
        id
        ficheInterventions {
          ...FullFicheIntervention
        }
      }
    }
    groupedIn {
      bsff {
        id
      }
    }
  }
  ${fullFicheIntervention}
`;