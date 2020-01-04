import React from "react";
import gql from "graphql-tag";
import { FaTimes } from "react-icons/fa";
import { Company, CompanyMember, UserRole } from "./AccountCompany";
import styles from "./AccountCompanyMember.module.scss";
import { useMutation } from "@apollo/react-hooks";

type Props = {
  company: Company;
  user: CompanyMember;
};

AccountCompanyMember.fragments = {
  company: gql`
    fragment AccountCompanyMemberCompanyFragment on CompanyPrivate {
      siret
    }
  `,
  user: gql`
    fragment AccountCompanyMemberUserFragment on CompanyMember {
      id
      isMe
      email
      name
      role
      isActive
      isPendingInvitation
    }
  `
};

const REMOVE_USER_FROM_COMPANY = gql`
  mutation RemoveUserFromCompany($userId: ID!, $siret: String!) {
    removeUserFromCompany(userId: $userId, siret: $siret) {
      id
      users {
        ...AccountCompanyMemberUserFragment
      }
    }
  }
  ${AccountCompanyMember.fragments.user}
`;

export default function AccountCompanyMember({ company, user }: Props) {
  const [removeUserFromCompany, { loading }] = useMutation(
    REMOVE_USER_FROM_COMPANY
  );

  return (
    <>
      <tr key={user.id}>
        <td>
          {user.name} {user.isMe && <span>(vous)</span>}
        </td>
        <td>{user.email}</td>
        <td>
          {user.role == UserRole.ADMIN ? "Administrateur" : "Collaborateur"}
        </td>
        <td>
          {user.isPendingInvitation
            ? "Invitation en attente"
            : user.isActive
            ? "Utilisateur actif"
            : "Email non confirmé"}
        </td>
        {!user.isMe && !user.isPendingInvitation && (
          <td className={styles["right-column"]}>
            <button
              className="button "
              onClick={() => {
                removeUserFromCompany({
                  variables: { siret: company.siret, userId: user.id }
                });
              }}
            >
              <FaTimes /> Retirer les droits
            </button>
          </td>
        )}
      </tr>
    </>
  );
}