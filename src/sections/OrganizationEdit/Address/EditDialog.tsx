import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import Dialog, { DialogProps } from '@mui/material/Dialog';

import { Address, AddressableType } from 'src/__generated__/graphql';

import AddressForm from 'src/sections/Address';

// ----------------------------------------------------------------------

interface Props extends DialogProps {
  addressableType: AddressableType;
  addressableId: string;
  address?: Address;
  onClose: VoidFunction;
  onSuccess: VoidFunction
}

export default function AddressEditDialog({
  onClose,
  onSuccess,
  address,
  addressableType,
  addressableId,
  ...other
}: Props) {
  return (
    <Dialog maxWidth="sm" onClose={onClose} {...other}>
      <DialogTitle>{address?.name || 'New address'}</DialogTitle>

      <DialogContent sx={{ overflow: 'unset' }}>
        <AddressForm
          address={address}
          addressableType={addressableType}
          addressableId={addressableId}
          onSuccess={onSuccess}
        />
      </DialogContent>
    </Dialog>
  );
}
