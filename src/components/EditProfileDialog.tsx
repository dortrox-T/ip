import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { User } from '@/types';

interface EditProfileDialogProps {
  user: User;
  onSave: (updatedUser: Partial<User>) => void;
}

const EditProfileDialog = ({ user, onSave }: EditProfileDialogProps) => {
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({
    displayName: user.displayName || '',
    username: user.username || '',
    bio: user.bio || '',
    profileImage: user.profileImage || '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
    setOpen(false);
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => ({
          ...prev,
          profileImage: reader.result as string
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="hover:border-instagram-purple hover:text-instagram-purple">
          Edit Profile
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold bg-instagram-gradient bg-clip-text text-transparent inline-block">
            Edit Profile
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="flex items-center gap-4">
              <Avatar className="w-16 h-16 ring-2 ring-offset-2 ring-instagram-purple">
                <AvatarImage src={formData.profileImage} alt={user.username} />
                <AvatarFallback className="bg-brand-300 text-white">
                  {user.username.slice(0, 2).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div>
                <Input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                  id="profileImage"
                />
                <Label 
                  htmlFor="profileImage" 
                  className="cursor-pointer text-sm text-instagram-blue hover:text-instagram-purple transition-colors"
                >
                  Change profile photo
                </Label>
              </div>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="displayName" className="text-muted-foreground">Name</Label>
              <Input
                id="displayName"
                name="displayName"
                value={formData.displayName}
                onChange={handleChange}
                className="focus-visible:ring-instagram-purple"
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="username" className="text-muted-foreground">Username</Label>
              <Input
                id="username"
                name="username"
                value={formData.username}
                onChange={handleChange}
                className="focus-visible:ring-instagram-purple"
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="bio" className="text-muted-foreground">Bio</Label>
              <Textarea
                id="bio"
                name="bio"
                value={formData.bio}
                onChange={handleChange}
                rows={3}
                className="focus-visible:ring-instagram-purple"
              />
            </div>
          </div>
          <div className="flex justify-end gap-2">
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => setOpen(false)}
              className="hover:border-instagram-purple hover:text-instagram-purple"
            >
              Cancel
            </Button>
            <Button 
              type="submit"
              className="bg-brand-gradient hover:opacity-90 text-white"
            >
              Save changes
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default EditProfileDialog; 