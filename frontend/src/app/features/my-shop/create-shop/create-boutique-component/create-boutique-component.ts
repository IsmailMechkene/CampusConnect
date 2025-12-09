import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';

@Component({
  selector: 'app-create-boutique',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './create-boutique-component.html',
  styleUrls: ['./create-boutique-component.css']
})
export class CreateBoutiqueComponent {
  model: any = {
    brandName: '',
    bio: '',
    description: '',
    email: '',
    phone: '',
    keyword: '',
    delivery: {
      onCampus: false,
      pickup: false,
      shipping: false
    },
    payments: {
      cod: false,
      card: false,
      edinar: false
    },
    categories: {} as Record<string, boolean>,
    social: {
      facebook: '',
      instagram: '',
      linkedin: '',
      x: '',
      tiktok: ''
    }
  };

  deliveryOptions = [
    { id: 'onCampus', label: 'On Campus' },
    { id: 'pickup', label: 'Pickup' },
    { id: 'shipping', label: 'Shipping' }
  ];

  paymentOptions = [
    { id: 'cod', label: 'Cash on Delivery' },
    { id: 'card', label: 'Card' },
    { id: 'edinar', label: 'E-Dinar' }
  ];

  categories = [
    'Handmade', 'Gift', 'Elegant', 'Wool', 'Clothing', 'Accessories', 'Electronics', 'Books', 'Beauty', 'Other'
  ];

  logoFile: File | null = null;
  bannerFile: File | null = null;
  logoPreview: string | ArrayBuffer | null = null;
  bannerPreview: string | ArrayBuffer | null = null;

  // UI state
  catLimitError = false;

  onLogoChange(e: Event) {
    const input = e.target as HTMLInputElement;
    if (!input.files?.length) return;
    this.logoFile = input.files[0];
    const reader = new FileReader();
    reader.onload = () => (this.logoPreview = reader.result);
    reader.readAsDataURL(this.logoFile);
  }

  onBannerChange(e: Event) {
    const input = e.target as HTMLInputElement;
    if (!input.files?.length) return;
    this.bannerFile = input.files[0];
    const reader = new FileReader();
    reader.onload = () => (this.bannerPreview = reader.result);
    reader.readAsDataURL(this.bannerFile);
  }

  togglePayment(id: string) {
    this.model.payments[id] = !this.model.payments[id];
  }

  toggleCategory(name: string) {
    const currently = !!this.model.categories[name];
    const selectedCount = Object.values(this.model.categories).filter(Boolean).length;

    // If trying to enable and already at limit -> block + show error
    if (!currently && selectedCount >= 4) {
      this.catLimitError = true;
      // clear after 3s
      setTimeout(() => (this.catLimitError = false), 3000);
      return;
    }

    // toggle
    this.model.categories[name] = !currently;
  }

  submit(form: NgForm) {
    // mark touched / show errors
    if (form.invalid) {
      form.control.markAllAsTouched();
      return;
    }

    // ensure keyword is a single word (defensive check)
    const kw = (this.model.keyword || '').toString().trim();
    const singleWord = /^\S+$/.test(kw);
    if (!singleWord) {
      // If the keyword somehow bypassed the template validator, we stop submission.
      alert('Keyword must be a single word with no spaces.');
      return;
    }

    const selectedPayments = Object.keys(this.model.payments).filter(k => this.model.payments[k]);
    const selectedCategories = Object.keys(this.model.categories).filter(k => this.model.categories[k]);

    const payload = {
      brandName: this.model.brandName,
      bio: this.model.bio,
      description: this.model.description,
      email: this.model.email,
      phone: this.model.phone,
      keyword: kw,
      delivery: this.model.delivery,
      payments: selectedPayments,
      categories: selectedCategories,
      social: this.model.social
    };

    const fd = new FormData();
    fd.append('data', JSON.stringify(payload));
    if (this.logoFile) fd.append('logo', this.logoFile);
    if (this.bannerFile) fd.append('banner', this.bannerFile);

    console.log('FormData ready', fd);
    // send fd via HttpClient if desired
  }
}
