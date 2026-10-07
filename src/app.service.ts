
import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  // Dữ liệu người dùng giả lập
  private users = [
    { id: 1, name: 'Nguyễn Văn A', age: 20 },
    { id: 2, name: 'Trần Thị B', age: 25 },
    { id: 3, name: 'Lê Văn C', age: 30 },
  ];

  // Bài cũ: tính tổng
  getSum(a: string, b: string) {
    const total = parseFloat(a) + parseFloat(b);

    return {
      message: 'Thành công',
      total: total,
    };
  }

  // Bài mới: tìm user theo ID
  getUserById(id: number) {
    return this.users.find(user => user.id === id);
  }
}