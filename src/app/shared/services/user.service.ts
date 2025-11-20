import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { User } from '../models/user.model';

@Injectable({ providedIn: 'root' })
export class UserService {
    private key = 'roots_users';
    private usersSubject = new BehaviorSubject<User[]>(this.load());
    users$ = this.usersSubject.asObservable();

  // Lockout policy
    readonly MAX_FAILED = 5;
    readonly LOCK_DURATION_MS = 15 * 60 * 1000; // 15 minutes

    getUsers(): User[] {
        return this.usersSubject.getValue();
    }

    findByEmail(email: string): User | undefined {
        return this.getUsers().find(u => u.email.toLowerCase() === email.toLowerCase());
    }

    addUser(user: User) {
        const list = [...this.getUsers(), {
            ...user,
            failedAttempts: 0,
            lockUntil: null
        }];
        this.save(list);
        this.usersSubject.next(list);
    }

  // Called on successful login
    resetFailedAttempts(email: string) {
        const list = this.getUsers().map(u => {
            if (u.email.toLowerCase() === email.toLowerCase()) {
                return { ...u, failedAttempts: 0, lockUntil: null };
            }
            return u;
        });
        this.save(list);
        this.usersSubject.next(list);
    }

  // Called on failed login attempt
    recordFailedAttempt(email: string) {
        const list = this.getUsers().map(u => {
            if (u.email.toLowerCase() === email.toLowerCase()) {
                const prev = u.failedAttempts ?? 0;
                const failed = prev + 1;
                let lockUntil = u.lockUntil ?? null;
                if (failed >= this.MAX_FAILED) {
                    lockUntil = Date.now() + this.LOCK_DURATION_MS;
                }
                return { ...u, failedAttempts: failed, lockUntil };
            }
            return u;
        });
        this.save(list);
        this.usersSubject.next(list);
    }

    isLocked(user: User | undefined): boolean {
        if (!user) return false;
        if (!user.lockUntil) return false;
        return Date.now() < user.lockUntil;
    }

    lockRemainingMs(user: User | undefined): number {
        if (!user || !user.lockUntil) return 0;
        return Math.max(0, user.lockUntil - Date.now());
    }

    private load(): User[] {
        const raw = localStorage.getItem(this.key);
            try {
                return raw ? (JSON.parse(raw) as User[]) : [];
            } catch {
                return [];
            }
    }

    private save(list: User[]) {
        localStorage.setItem(this.key, JSON.stringify(list));
    }
}
